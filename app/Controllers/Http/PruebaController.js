'use strict'

class PruebaController {
  Prueba({ params, request, response }){
    //response.header('Content-type', 'application/json')
    return response.status(200).json({ message: 'Car deleted!' })
  }
}

module.exports = PruebaController
