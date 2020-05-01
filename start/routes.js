'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  Route.get('/Student/:id', 'StudentController.GetStudent')
  Route.post('/Student', 'StudentController.SetStudent')

  Route.get('/Course/:id', 'CourseController.GetCourse')
  Route.post('/Course', 'CourseController.SetCourse')

  Route.post('/Grade', 'GradeController.SetGrade')
  Route.get('/Grade/Last', 'GradeController.GetLastGrades')
  Route.get('/Grade/all/:studentId', 'GradeController.GetGradesById')
}).prefix('/api')

Route.get('/', 'SiteController.Index')
Route.on('/').render('index')

Route.get('/Student', 'SiteController.StudentReport')

Route.post('/Login', 'LoginController.Login')
Route.get('/Login', async function ({ auth, view, response, request }) {
  try {
    await auth.check()
    response.route('/')
  } catch (e) {
    //console.log(e);
  }
  return view.render('login')
})

Route.get('/Register', 'LoginController.Register')

Route.group('autenticate', function () {
  Route.get('/Logout','LoginController.Logout')

  Route.on('/Register-Course').render('register_course', { isLogin : true })
  Route.post('Register-Course', 'SiteController.SetCourse')

  Route.on('/Register-Grade').render('register_grade', { isLogin : true })
  Route.post('Register-Grade', 'SiteController.SetGrade')

  Route.on('/Register-Student').render('register_student', { isLogin : true })
  Route.post('Register-Student', 'SiteController.SetStudent')
}).middleware('CustomAuthProtect')