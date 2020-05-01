'use strict'
var GradeChainJSON = require("../../Contracts/build/contracts/GradeChain.json");
const Env = use('Env')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(Env.get('ROPSTEN_PROVIDER')))

class SiteController {
    async Index({ view, auth }) {
        var records = []


        try {
            var GradeChainContract = new web3.eth.Contract(GradeChainJSON.abi, GradeChainJSON.networks["3"].address)
            var contractEvents = await GradeChainContract.getPastEvents('AddGrade', { fromBlock: 0, toBlock: 'latest' })

            var size = contractEvents.length
            for (var i = size - 1; i >= 0; i--) {
                var record = {}
                record.txHash = contractEvents[i].transactionHash.toString()
                record.blockNumber = contractEvents[i].returnValues["0"].toString()
                record.studentId = contractEvents[i].returnValues["1"].toString()
                record.courseId = contractEvents[i].returnValues["2"].toString()
                record.grade = contractEvents[i].returnValues["3"].toString()

                records.push(record)                
            }
        } catch (e) {

        }


        try {
            await auth.check()
            return await view.render('index', { records: records, isLogin: true })
        } catch (e) {
            //console.log(e);
        }
        return await view.render('index', { records: records, isLogin: false })

    }

    async StudentReport({ view, request, response, auth }) {
        let studentId = request.only('studentId').studentId

        var isLoged = false;

        try {
            await auth.check()
            isLoged = true;
        } catch (e) {
            //console.log(e);
        }

        if (studentId) {
            var GradeChainContract = new web3.eth.Contract(GradeChainJSON.abi, GradeChainJSON.networks["3"].address);

            var student = await GradeChainContract.methods.getStudentById(studentId).call();

            if (student) {
                var studentInfo = {}
                var courseGrades = []
                studentInfo.grades = courseGrades
                if (parseInt(student["0"], 16) > 0) {
                    studentInfo.blockNumber = student["0"].toString()
                    studentInfo.studentId = student["1"].toString()
                    studentInfo.firstName = student["2"]
                    studentInfo.lastName = student["3"]
                    studentInfo.career = student["4"]
                    studentInfo.birthDate = student["5"]
                    studentInfo.image = null

                    GradeChainContract = new web3.eth.Contract(GradeChainJSON.abi, GradeChainJSON.networks["3"].address)

                    var grades = await GradeChainContract.methods.getStudentGradesById(studentId).call()

                    if (grades) {

                        var size = grades.blockNumbers.length
                        for (var i = 0; i < size; i++) {
                            var grade = {}
                            grade.blockNumber = grades.blockNumbers[i].toString()
                            grade.studentId = studentId.toString()
                            grade.courseId = grades.course[i].toString()

                            var course = await GradeChainContract.methods.getCourseById(grades.course[i].toString()).call()
                            grade.courseName = course["2"].toString()

                            grade.grade = grades.grade[i].toString()
                            courseGrades.push(grade)
                        }
                    }

                    return await view.render('student_report', { student: studentInfo, isLogin: isLoged })
                } else {
                    //return response.status(404).json({ message: 'Don\'t exists student.' })
                }

            } else {
                //return response.status(404).json({ message: 'Don\'t exists student.' })
            }


        } else {
            return response.status(400).json({ message: 'Bad request, don\'t send id.' })
        }
    }

    async SetStudent({ request, view }) {
        var data = {}

        let id = request.input('studentId')
        let firstName = request.input('firstName')
        let lastName = request.input('lastName')
        let career = request.input('career')
        let birthDate = request.input('birthDate')
        //let image = request.input('image')

        console.log(id, firstName, lastName, career, birthDate)

        data.studentId = id
        data.firstName = firstName
        data.lastName = lastName
        data.career = career
        data.birthDate = birthDate

        if (id && firstName && lastName && career && birthDate) {
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
                    .on('transactionHash', function (hash) {
                        console.log(hash);
                        tranHash = hash
                    }).on('confirmation', function (confirmationNumber, receipt) {
                        console.log(receipt);
                        tranReceipt = receipt
                    })

                data.block = tranReceipt.blockNumber.toString()
                data.tranHash = tranHash

                var success = 'Student registered.'

                return await view.render('register_student', { data: data, success: success, isLogin: true })


            } catch (e) {
                var err = 'Already exists student id'
                return await view.render('register_student', { data: data, err: err, isLogin: true })
            }
        } else {
            var err = 'Complete all fields'
            return await view.render('register_student', { data: data, err: err, isLogin: true })
        }
    }

    async SetCourse({ view, request }) {
        var data = {}

        let id = request.input('courseId')
        let name = request.input('courseName')

        data.courseId = id
        data.courseName = name

        if (id && name) {
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
                    .on('transactionHash', function (hash) {
                        console.log(hash);
                        tranHash = hash
                    }).on('confirmation', function (confirmationNumber, receipt) {
                        console.log(receipt);
                        tranReceipt = receipt
                    })

                var success = 'Course registered.'

                data.tranHash = tranHash 
                data.block = tranReceipt.blockNumber.toString()

                return await view.render('register_course', { data: data, success: success, isLogin: true })

            } catch (e) {
                var err = 'Alredy exists course id.'
                return await view.render('register_course', { data: data, err: err, isLogin: true })
            }
        } else {
            var err = 'Complete all fields'
            console.log(data)
            return await view.render('register_course', { data: data, err: err, isLogin: true })
        }
    }

    async SetGrade({ view, request }) {
        var data = {}
        
        let studentId = request.input('studentId')
        let courseId = request.input('courseId')
        let grade = request.input('grade')

        data.studentId = studentId
        data.courseId = courseId
        data.grade = grade

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
                    .on('transactionHash', function (hash) {
                        console.log(hash);
                        tranHash = hash
                    }).on('confirmation', function (confirmationNumber, receipt) {
                        console.log(receipt);
                        tranReceipt = receipt
                    })

                var success = 'Grade registered.'

                data.tranHash = tranHash 
                data.block = tranReceipt.blockNumber.toString()

                return await view.render('register_grade', { data: data, success: success, isLogin: true })

            } catch (e) {
                var err = 'Alredy exists grade.'
                return await view.render('register_grade', { data: data, err: err, isLogin: true })
            }
        } else {
            var err = 'Complete all fields'
            console.log(data)
            return await view.render('register_grade', { data: data, err: err, isLogin: true })
        }
    }
}

module.exports = SiteController
