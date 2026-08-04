export function totalBalance(accounts) {
    return accounts.reduce((sum, account) => {
        return sum + account.balance;
    }, 0);
}

export function totalBalanceByType(accounts, type) {
    return accounts.reduce((sum, account) => {
        return account.balance_type === type
            ? sum + account.balance
            : sum;
    }, 0);
}

export function totalNetWorth(accounts) {
    const assets = totalBalanceByType(accounts, "asset");
    const liabilities = totalBalanceByType(accounts, "liability");

    return assets - liabilities;
}