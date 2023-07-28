export const getContract = async (web3, contractInterface) => {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = contractInterface.networks[networkId];

    return new web3.eth.Contract(
        contractInterface.abi,
        deployedNetwork && deployedNetwork.address
    );
}