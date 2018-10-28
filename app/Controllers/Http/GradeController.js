'use strict'

class GradeController {
  SetGrade({request, response}){
    let studentId = request.input('studentId')
    let courseId = request.input('courseId')
    let grade = request.input('grade')

    console.log(studentId , courseId, grade);

    if(studentId && courseId && grade){
      return response.status(200).json({
        message : 'Success'
      })
    }else{
      return response.status(400).json({
        message: 'Bad request, don\'t send id.'
      })
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
