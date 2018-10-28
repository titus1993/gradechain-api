'use strict'

class StudentController {
  GetStudent ({ params, response }){
    let id = params.id
    if(id){
      if(id == "201213587"){
        return response.status(200).json(
          {
            message : 'Success',
            student :
            {
              id : '201213587',
              firstName : 'Marvin Emmanuel',
              lastName : 'Pivaral Orellana',
              career : 'Ingenieria en Ciencias y Sistemas',
              birthDate : '08/31/2018',
              image : null
            }
          }
        )
      }else{
        return response.status(404).json({ message: 'Don\'t exists student.' })
      }
    }else{
      return response.status(400).json({ message: 'Bad request, don\'t send id.' })
    }
  }

  SetStudent({response, request}){
    let id = request.input('id')
    let firstName = request.input('firstName')
    let lastName = request.input('lastName')
    let career = request.input('career')
    let birthDate = request.input('birthDate')
    let image = request.input('image')

    return response.status(200).json(
      {
        message : 'Success',
        student :
        {
          id : id,
          firstName : firstName,
          lastName : lastName,
          career : career,
          birthDate : birthDate,
          image : null
        }
      }
    )
  }
}

module.exports = StudentController
