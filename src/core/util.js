export function delay(s) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, s);
    })
}

export function getTxtype(type) {
    if(type === 0xd0) {
        return 'Deploy'
    } else if(type === 0xd1) {
        return 'Invoke'
    }
}