/* eslint-disable */

// System on TPTP Webworker

onmessage = async function(request) {
    const formData = new FormData();
    formData.append("TPTPProblem", "");
    formData.append("ProblemSource", "FORMULAE");
    formData.append("FORMULAEProblem", request.data.Task);
    formData.append("QuietFlag", "-q01");
    formData.append("ForceSystem", "-force");
    formData.append("SubmitButton", "RunSelectedSystems");
    formData.append("System___E---", "E---");

    const re = /--cpu-limit=(\d+)/;
    for(let a in request.data.Args) {
        let m = request.data.Args[a].match(re);
        if(m) {
            formData.append("TimeLimit___E---", m[1]);
        }
    }

    const systemOnTPTP = new Request("https://www.tptp.org/cgi-bin/SystemOnTPTPFormReply", {
        method: 'POST',
        body: formData
    });

    fetch(systemOnTPTP).then(async function(response) {
        if (response && response.status === 200) {
            const text = await response.text();
            postMessage({ Req: "proverOut", error: false,  html: text});
            postMessage({ Req: "proverDone" });
        }
    });
}