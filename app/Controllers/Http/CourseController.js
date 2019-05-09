'use strict'

var GradeChainJSON = require("../../Contracts/build/contracts/GradeChain.json");
const Env = use('Env')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(Env.get('ROPSTEN_PROVIDER')))

class CourseController {
  async GetCourse ({ params, response }){
    let id = params.id

    if(id){
      var GradeChainContract = new web3.eth.Contract(GradeChainJSON.abi, GradeChainJSON.networks["3"].address);

      var course = await GradeChainContract.methods.getCourseById(id).call();

      if(course){
        if(parseInt(course["0"], 16) > 0){
          return response.status(200).json(
            {
              message : 'Success',
              course :
              {
                block : course["0"].toString(),
                id : course["1"].toString(),
                name : course["2"].toString()
              }
            }
          )
        }else{
          return response.status(404).json({ message: 'Don\'t exists course.' })
        }
      }else{
        return response.status(404).json({ message: 'Don\'t exists course.' })
      }
    }else{
      return response.status(400).json({ message: 'Bad request, don\'t send id.' })
    }
  }

  async SetCourse({response, request}){
    let id = request.input('id')
    let name = request.input('name')

    if(id && name){
      var GradeChainContract = new web3.eth.Contract(GradeChainJSON.abi, GradeChainJSON.networks["3"].address)

      var addCourseAbi = GradeChainContract.methods.addCourse(id, name).encodeABI()

      var nonce = await web3.eth.getTransactionCount(Env.get('ROPSTEN_PUBLIC_KEY'))

      var signedTransaction = await web3.eth.accounts.signTransaction({
          from: Env.get('ROPSTEN_PUBLIC_KEY'),
          to: GradeChainJSON.networks["3"].address,
          data: addCourseAbi,
          gasLimit: 500000,
          chainId: 3,
          nonce: nonce
      }, Env.get('ROPSTEN_PRIVATE_KEY'));

      web3.eth.transactionConfirmationBlocks = 1

      try {
        var tranHash, tranReceipt
        await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
        .on('transactionHash', function(hash){
          console.log(hash);
          tranHash = hash
        }).on('confirmation', function(confirmationNumber, receipt){
          console.log(receipt);
          tranReceipt = receipt
        })

        return response.status(200).json(
          {
            message : 'Success',
            student :
            {
              tranHash: tranHash,
              block : tranReceipt.blockNumber.toString(),
              id : id,
              firstName : name
            }
          }
        )
      } catch (e) {
        return response.status(404).json({ message: 'Alredy exists course.' })
      }
    }else{
      if(id && name){
        return response.status(400).json({
          message: 'Bad request, don\'t send id and name.'
        })
      }else if(id){
        return response.status(400).json({
          message: 'Bad request, don\'t send id.'
        })
      }else{
        return response.status(400).json({
          message: 'Bad request, don\'t send name.'
        })
      }
    }
  }
}

module.exports = CourseController
