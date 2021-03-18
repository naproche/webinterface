import { createStore } from "vuex";

// Recursively get an array of all files in a github repository.
// Hits the rate limit of githubs API too quickly :(
// export async function getGithubTree(owner, repo, commit) {
//   var url = "https://api.github.com/repos/" + owner + "/" + repo + "/git/trees/" + commit;
//   var root = (await (await fetch(url)).json())["tree"];
//   var blobs = root.filter(obj => obj["type"] == "blob").map(obj => obj["path"]);
//   var dirs = root.filter(obj => obj["type"] == "tree").map(obj => {
//       return getGithubTree(owner, repo, obj["sha"])
//         .then(res => { console.log(typeof(res)); res.map(name => obj["path"] + name) })
//         .else(_ => []);
//     });
//   return blobs.concat(await Promise.all(dirs));
// }

export const FetchLibraryGithub = {
  async fetchLibrary(name) {
    let url =
      "https://raw.githubusercontent.com/naproche-community/naproche/master/examples/" +
      name;
    return await fetch(url);
  }
};

export function fetchUserGithub(owner, repo, commit) {
  return {
    async fetchUser(name) {
      let url =
        "https://raw.githubusercontent.com/" +
        owner +
        "/" +
        repo +
        "/" +
        commit +
        "/" +
        name;
      return await fetch(url);
    }
  };
}

// Map filenames to file contents
// We  first try reading the user provided files
// and if this fails we read the library files.
// To avoid many calls to 'fetch', we also
// store a filename if it is not present (exists: false)
const FileStore = {
  state: {
    userFiles: {},
    libraryFiles: {}
  },
  mutations: {
    addUserFile(state, payload) {
      state.userFiles[payload.name] = { exists: true, content: payload.content };
    },
    addLibraryFile(state, payload) {
      state.libraryFiles[payload.name] = { exists: true, content: payload.content };
    },
    noUserFile(state, name) {
      state.userFiles[name] = { exists: false, content: "" };
    },
    noLibraryFile(state, name) {
      state.libraryFile[name] = { exists: false, content: "" };
    }
  },
  getters: {
    readFile: (state) => (name) => {
      if (state.userFiles[name] && state.userFiles[name].exists) {
        return state.userFiles[name].content;
      } else if (state.libraryFiles[name]) {
        return state.libraryFiles[name].content;
      }
      return null;
    }
  },
  actions: {
    async loadFile(context, payload) {
      let userFile = context.state.userFiles[payload.name];
      let libraryFile = context.state.libraryFiles[payload.name];
      if (!userFile) {
        let response = await payload.fetchUser(payload.name);
        if (response.status === 200) {
          let fetched = await response.text();
          console.log(fetched);
          context.commit("addUserFile", { name: payload.name, content: fetched });
        } else {
          context.commit("noUserFile", payload.name);
          if (!libraryFile) {
            let response = await payload.fetchLibrary(payload.name);
            if (response.status === 200) {
              let fetched = await response.text();
              context.commit("addLibraryFile", { name: payload.name, content: fetched });
            } else {
              context.commit("noLibraryFile", payload.name);
            }
          }
        }
      }
    }
  }
};

// A cache of filenames -> binary
// https://developer.mozilla.org/en-US/docs/Web/API/Cache
const CacheStore = {
  state: {
    cache: undefined
  },
  mutations: {
    init(state, cache) {
      state.cache = cache;
    }
  },
  actions: {
    async init(context) {
      if(context.state.cache === undefined) {
        const cache = await caches.open("naproche-cache");
        context.commit("init", cache);
      }
    },
    async store(context, payload) {
      await context.dispatch("init");
      context.state.cache.put(payload.req, payload.resp);
    },
    async retrieve(context, name) {
      await context.dispatch("init");
      return context.state.cache.match(name);
    }
  }
};

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    files: FileStore,
    cache: CacheStore
  }
});
