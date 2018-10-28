'use strict'

class CourseController {
  GetCourse ({ params, response }){
    let id = params.id
    if(id){
      if(id == "280"){
        return response.status(200).json(
          {
            message : 'Success',
            course :
            {
              id : '280',
              name : 'Sistemas Operativos 2'
            }
          }
        )
      }else{
        return response.status(404).json({ message: 'Don\'t exists course.' })
      }
    }else{
      return response.status(400).json({ message: 'Bad request, don\'t send id.' })
    }
  }

  SetCourse({response, request}){
    let id = request.input('id')
    let name = request.input('name')

    return response.status(200).json(
      {
        message : 'Success',
        student :
        {
          id : id,
          firstName : name
        }
      }
    )
  }
}

module.exports = CourseController
