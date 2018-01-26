async function api({startDate, endDate}, resp) {

    const method = 'GET';
    const uri = `http://104.197.128.152/data/adrequests?from=${startDate}&to=${endDate}`;

    const res = await fetch(uri, {
        method,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: undefined,
    });

    const resBody = await res.json()
        .catch(() => res.text())
        .catch(() => null);

    let respError = null;
    let respSuccess = resBody;
    if (!res.ok) {
        respError = resBody;
        respSuccess = null;
    }

    resp(respError, {body: respSuccess});
}

export default api;