// remove this soon
export function createResource(promise) {
    let status = 'pending';
    let result;

    const suspender = promise.then(
        (res) => {
            status = 'success';
            result = res;
        },
        (err) => {
            status = 'error';
            result = err;
        }
    );

    return {
        read() {
            if (status === 'pending') throw suspender;
            if (status === 'error') throw result;
            return result;
        }
    };
}