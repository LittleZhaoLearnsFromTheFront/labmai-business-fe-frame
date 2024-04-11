
const sleep = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(1)
        }, 5000)
    })
}
export const getInitialState = async () => {
    await sleep()
    return {
        c: 1
    }
}