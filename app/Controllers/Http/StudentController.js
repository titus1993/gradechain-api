'use strict'
var GradeChainJSON = require("../../Contracts/build/contracts/GradeChain.json");
const Env = use('Env')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(Env.get('ROPSTEN_PROVIDER')))



class StudentController {
  async GetStudent ({ params, response }){
    let id = params.id

    if(id){
      var GradeChainContract = new web3.eth.Contract(GradeChainJSON.abi, GradeChainJSON.networks["3"].address);

      var student = await GradeChainContract.methods.getStudentById(id).call();

      if(student){
        if(parseInt(student["0"], 16) > 0){
          return response.status(200).json(
            {
              message : 'Success',
              student :
              {
                block : student["0"].toString(),
                id : student["1"].toString(),
                firstName : student["2"],
                lastName : student["3"],
                career : student["4"],
                birthDate : student["5"],
                image : null
              }
            }
          )
        }else{
          return response.status(404).json('Don\'t exists student.')
        }
      }else{
        return response.status(404).json('Don\'t exists student.')
      }
    }else{
      return response.status(400).json('Bad request, don\'t send id.')
    }
  }

  async SetStudent({response, request}){
    let id = request.input('id')
    let firstName = request.input('firstName')
    let lastName = request.input('lastName')
    let career = request.input('career')
    let birthDate = request.input('birthDate')
    let image = request.input('image')

    if(id && firstName && lastName && career && birthDate){
      var GradeChainContract = new web3.eth.Contract(GradeChainJSON.abi, GradeChainJSON.networks["3"].address)

      var addStudentAbi = GradeChainContract.methods.addStudent(id, firstName, lastName, career, birthDate).encodeABI()

      var nonce = await web3.eth.getTransactionCount(Env.get('ROPSTEN_PUBLIC_KEY'))

      var signedTransaction = await web3.eth.accounts.signTransaction({
          from: Env.get('ROPSTEN_PUBLIC_KEY'),
          to: GradeChainJSON.networks["3"].address,
          data: addStudentAbi,
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
              firstName : firstName,
              lastName : lastName,
              career : career,
              birthDate : birthDate,
              image : image
            }
          }
        )
      } catch (e) {
        return response.status(404).json({ message: 'Ya existe el estudiante.' })
      }
    }else{
      if(id){
        return response.status(400).json({
          message: 'Bad request, don\'t send id.'
        })
      }else if(firstName){
        return response.status(400).json({
          message: 'Bad request, don\'t send firstName.'
        })
      }else if(lastName){
        return response.status(400).json({
          message: 'Bad request, don\'t send lastName.'
        })
      }else if(career){
        return response.status(400).json({
          message: 'Bad request, don\'t send career.'
        })
      }else{
        return response.status(400).json({
          message: 'Bad request, unknown error.'
        })
      }
    }
  }
}

module.exports = StudentController
