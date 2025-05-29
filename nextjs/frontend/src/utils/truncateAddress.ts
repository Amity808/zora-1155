export const truncateAddress = (address: `0x${string}`) => {
    if(!address) return;
    return address.slice(0,8) + "..." + address.slice(address.length - 4, address.length)
}

export const truncateString = (value: string) => {
    if(!value) return;
    return value.length > 20? value.slice(0, 20) + "..." : value;
}


export const truncateBalance = (balance: string, maxLength: number = 8): string => {
    if (balance.length <= maxLength) return balance;
    return `${balance.slice(0, maxLength)}...`;
  };