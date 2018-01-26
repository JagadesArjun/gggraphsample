async function api({startDate, endDate}, resp) {

    const method = 'GET';
    const uri = `/data/adrequests?from=${startDate}&to=${endDate}`;

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
        respError = 'Some error occurred';
        respSuccess = null;
    }

    resp(respError, {body: respSuccess});
}

export default api;