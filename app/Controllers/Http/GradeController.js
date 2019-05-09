'use strict'
var GradeChainJSON = require("../../Contracts/build/contracts/GradeChain.json");
const Env = use('Env')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(Env.get('ROPSTEN_PROVIDER')))

class GradeController {
  async SetGrade({request, response}){
    let studentId = request.input('studentId')
    let courseId = request.input('courseId')
    let grade = request.input('grade')

    if(studentId && courseId && grade){
      var GradeChainContract = new web3.eth.Contract(GradeChainJSON.abi, GradeChainJSON.networks["3"].address)

      var addGradeAbi = GradeChainContract.methods.addGrade(studentId, courseId, grade).encodeABI()

      var nonce = await web3.eth.getTransactionCount(Env.get('ROPSTEN_PUBLIC_KEY'))

      var signedTransaction = await web3.eth.accounts.signTransaction({
          from: Env.get('ROPSTEN_PUBLIC_KEY'),
          to: GradeChainJSON.networks["3"].address,
          data: addGradeAbi,
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
              tranHash : tranHash,
              block : tranReceipt.blockNumber.toString(),
              studentId : studentId,
              courseId : courseId,
              grade: grade
            }
          }
        )
      } catch (e) {
        return response.status(404).json({ message: 'Alredy exists grade.' })
      }
    }else{
      if(studentId){
        return response.status(400).json({
          message: 'Bad request, don\'t send student id.'
        })
      }else if(courseId){
        return response.status(400).json({
          message: 'Bad request, don\'t send course id.'
        })
      }else if(grade){
        return response.status(400).json({
          message: 'Bad request, don\'t send grade.'
        })
      }else{
        return response.status(400).json({
          message: 'Bad request, unknown error.'
        })
      }
    }
  }

  GetGradesById({params, response}){
    let studentId = params.studentId
    if(studentId){
      if(studentId == "201213587"){
        return response.status(200).json(
          {
            message : 'Success',
            studentId : studentId,
            grades :
            [
              {
                txHash : '0x9082b45ecaa7dd14ee1501088a926b0514c9fb6c6d22b2e8abfb65488fbddbf3',
                blockNumber : '6601254',
                date : '08/31/2018',
                courseId : '281',
                courseName : 'Sistemas Operativos 2',
                grade : '80'
              },
              {
                txHash : '0x9082b45ecaa7dd14ee1501088a926b0514c9fb6c6d22b2e8abfb65488fbddbf3',
                blockNumber : '6601254',
                date : '08/31/2018',
                courseId : '281',
                courseName : 'Sistemas Operativos 2',
                grade : '80'
              },
              {
                txHash : '0x9082b45ecaa7dd14ee1501088a926b0514c9fb6c6d22b2e8abfb65488fbddbf3',
                blockNumber : '6601254',
                date : '08/31/2018',
                courseId : '281',
                courseName : 'Sistemas Operativos 2',
                grade : '80'
              },
              {
                txHash : '0x9082b45ecaa7dd14ee1501088a926b0514c9fb6c6d22b2e8abfb65488fbddbf3',
                blockNumber : '6601254',
                date : '08/31/2018',
                courseId : '281',
                courseName : 'Sistemas Operativos 2',
                grade : '80'
              }
            ]
          }
        )
      }else{
        return response.status(404).json({ message: 'Don\'t exists course.' })
      }
    }else{
      return response.status(400).json({ message: 'Bad request, don\'t send id.' })
    }
  }

  GetLastGrades({response}){
    return response.status(200).json({
      message : 'Success',
      grades : [
        {
          txHash : '0x9082b45ecaa7dd14ee1501088a926b0514c9fb6c6d22b2e8abfb65488fbddbf3',
          blockNumber : '6601254',
          studentId : '201212859',
          courseId : '281',
          grade : '80'
        },
        {
          txHash : '0x9082b45ecaa7dd14ee1501088a926b0514c9fb6c6d22b2e8abfb65488fbddbf3',
          blockNumber : '6601254',
          studentId : '201212859',
          courseId : '282',
          grade : '80'
        },
        {
          txHash : '0x9082b45ecaa7dd14ee1501088a926b0514c9fb6c6d22b2e8abfb65488fbddbf3',
          blockNumber : '6601254',
          studentId : '201212859',
          courseId : '283',
          grade : '80'
        },
        {
          txHash : '0x9082b45ecaa7dd14ee1501088a926b0514c9fb6c6d22b2e8abfb65488fbddbf3',
          blockNumber : '6601254',
          studentId : '201212859',
          courseId : '284',
          grade : '80'
        },
        {
          txHash : '0x9082b45ecaa7dd14ee1501088a926b0514c9fb6c6d22b2e8abfb65488fbddbf3',
          blockNumber : '6601254',
          studentId : '201212859',
          courseId : '285',
          grade : '80'
        },
        {
          txHash : '0x9082b45ecaa7dd14ee1501088a926b0514c9fb6c6d22b2e8abfb65488fbddbf3',
          blockNumber : '6601254',
          studentId : '201212859',
          courseId : '286',
          grade : '80'
        },
        {
          txHash : '0x9082b45ecaa7dd14ee1501088a926b0514c9fb6c6d22b2e8abfb65488fbddbf3',
          blockNumber : '6601254',
          studentId : '201212859',
          courseId : '287',
          grade : '80'
        },
        {
          txHash : '0x9082b45ecaa7dd14ee1501088a926b0514c9fb6c6d22b2e8abfb65488fbddbf3',
          blockNumber : '6601254',
          studentId : '201212859',
          courseId : '288',
          grade : '80'
        },
        {
          txHash : '0x9082b45ecaa7dd14ee1501088a926b0514c9fb6c6d22b2e8abfb65488fbddbf3',
          blockNumber : '6601254',
          studentId : '201212859',
          courseId : '289',
          grade : '80'
        }
      ]
    }
  )}
}

module.exports = GradeController
