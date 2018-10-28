'use strict'

class StudentController {
  GetStudent ({ params, request, response }){
    console.log('asdf')
    const id = request.input('id')
    if(id){
      return response.status(200).json(
        {
          message : 'Car deleted!',
          students :
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
      return response.status(400).json({ message: 'Car deleted!' })
    }
  }
}

module.exports = StudentController
