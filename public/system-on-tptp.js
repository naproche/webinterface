/* eslint-disable */

// System on TPTP Webworker
// TODO: Doesn't work currently, as the CORS header is not set correctly by System on TPTP.

onmessage = async function(request) {
    const formData = new FormData();
    formData.append("TPTPProblem", "");
    formData.append("ProblemSource", "FORMULAE");
    formData.append("FORMULAEProblem", request.data.Task);
    formData.append("QuietFlag", "-q01");
    formData.append("ForceSystem", "-force");
    formData.append("SubmitButton", "RunSelectedSystems");
    formData.append("System___E---2.6.X", "E---2.6.X");
    formData.append("TimeLimit___E---2.6.X", "10");
    formData.append("Command___E---2.6.X", "run_E %s %d THM");

    const systemOnTPTP = new Request("http://www.tptp.org/cgi-bin/SystemOnTPTPFormReply", {
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