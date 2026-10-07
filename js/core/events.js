const listeners = {};

export function on(
    event,
    callback
) {

    if (!listeners[event]) {

        listeners[event] = [];

    }

    listeners[event].push(
        callback
    );

    return () => {

        listeners[event] =
            listeners[event]
                .filter(
                    fn =>
                        fn !== callback
                );

    };

}


export function emit(
    event,
    data
) {

    (
        listeners[event] ||
        []
    ).forEach(
        callback => {

            try {

                callback(data);

            } catch(error) {

                console.error(
                    `Event "${event}" failed:`,
                    error
                );

            }

        }
    );

}
