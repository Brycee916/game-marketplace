import Web3 from 'web3';
import GameMarketplaceABI from '../contracts/GameMarketplace.json';

export const getGameMarketplaceContract = async () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = GameMarketplaceABI.networks[networkId];
    
    if (deployedNetwork) {
      return new web3.eth.Contract(
        GameMarketplaceABI.abi,
        deployedNetwork.address
      );
    } else {
      console.error('Contract not deployed to this network');
      return null;
    }
  }
  console.error('Ethereum provider not found');
  return null;
};
