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

  async GetGradesById({params, response}){
    let studentId = params.studentId

    if(studentId){
      var GradeChainContract = new web3.eth.Contract(GradeChainJSON.abi, GradeChainJSON.networks["3"].address)

      var grades = await GradeChainContract.methods.getStudentGradesById(studentId).call()

      if(grades){
        var jsonGrades = {}
        var courseGrades = []
        jsonGrades.message = 'Success'
        jsonGrades.grades = courseGrades

        var size = grades.blockNumbers.length
        for(var i=0; i < size; i++){
          var grade = {}
          grade.blockNumber = grades.blockNumbers[i].toString()
          grade.studentId = studentId.toString()
          grade.courseId = grades.course[i].toString()

          var course = await GradeChainContract.methods.getCourseById(grades.course[i].toString()).call()
          grade.courseName = course["2"].toString()

          grade.grade = grades.grade[i].toString()
          courseGrades.push(grade)
        }

        console.log(jsonGrades)

        return response.status(200).json(jsonGrades)
      }else{
        return response.status(404).json({ message: 'Don\'t exists student.' })
      }
    }else{
      return response.status(400).json({ message: 'Bad request, don\'t send student id.' })
    }
  }

  async GetLastGrades({response}){
    var jsonEvents = {}
    jsonEvents.message = 'Success'
    var events = []
    jsonEvents.events = events

    try {
      var GradeChainContract = new web3.eth.Contract(GradeChainJSON.abi, GradeChainJSON.networks["3"].address)
      var contractEvents = await GradeChainContract.getPastEvents('AddGrade', {fromBlock: 0, toBlock: 'latest'})

      var size = contractEvents.length
      for(var i = size - 1; i >= 0; i--){
        var event = {}
        event.txHash = contractEvents[i].transactionHash.toString()
        event.blockNumber = contractEvents[i].returnValues["0"].toString()
        event.studentId = contractEvents[i].returnValues["1"].toString()
        event.courseId = contractEvents[i].returnValues["2"].toString()
        event.grade = contractEvents[i].returnValues["3"].toString()

        events.push(event)
      }

      return response.status(200).json(jsonEvents)
    } catch (e) {
      jsonEvents.message = e.toString()
      return response.status(200).json(jsonEvents)
    }
  }
}

module.exports = GradeController
