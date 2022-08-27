//SPDX-License-Identifier:MIT

pragma solidity ^0.8.14;

contract Lottery{

    address public manager;
    address[]public  participant;
    address public winner;


    constructor(){
        manager=msg.sender;
    }

    receive() external payable{
        require(msg.value==1 ether);
        participant.push(msg.sender);

    }
    function lotterypart()public payable {
         require(msg.value==1 ether);
        participant.push(msg.sender);
    }

    function Random()internal view returns(uint){

        return uint(keccak256(abi.encodePacked(block.difficulty,block.timestamp,participant.length)));


    }

    function balance()public view returns(uint){
        require(msg.sender==manager);
        return address(this).balance;
    }

    function pikwinner()public returns(address) {
        require(msg.sender==manager);
        uint r=Random();
        uint d=r % participant.length;
        winner=participant[d];

        payable(participant[d]).transfer(balance());
       return address(participant[d]) ;
        
        

    }


}
//returns(address)
// return participant[d];