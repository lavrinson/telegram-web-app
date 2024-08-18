let stakedNFTs = {};

function stakeNFT(nftId) {
    const nftCard = document.querySelector(`.nft-card:nth-child(${nftId})`);
    const stakedCard = nftCard.cloneNode(true);
    stakedCard.classList.add('staked-nft-card');

    const stakeButton = stakedCard.querySelector('.stake-button');
    stakeButton.remove();

    document.getElementById('staked-cards').appendChild(stakedCard);
    nftCard.remove();

    stakedNFTs[nftId] = Date.now();
    alert('Карточка отправлена в стейкинг!');
}

function calculateStakingRewards(stakedTime) {
    const coinsPerHour = 1;
    const hoursStaked = Math.floor(stakedTime / (1000 * 60 * 60));
    return hoursStaked * coinsPerHour;
}

function updateStakingRewards() {
    const stakedCardsContainer = document.getElementById('staked-cards');

    for (let nftId in stakedNFTs) {
        const stakingStartTime = stakedNFTs[nftId];
        const stakedTime = Date.now() - stakingStartTime;
        const rewards = calculateStakingRewards(stakedTime);

        const stakedCard = stakedCardsContainer.querySelector(`.staked-nft-card:nth-child(${nftId})`);
        let rewardsElement = stakedCard.querySelector('.staking-rewards');

        if (!rewardsElement) {
            rewardsElement = document.createElement('div');
            rewardsElement.classList.add('staking-rewards');
            stakedCard.appendChild(rewardsElement);
        }

        rewardsElement.textContent = `Награды: ${rewards} монет`;
    }
}

setInterval(updateStakingRewards, 5000);
