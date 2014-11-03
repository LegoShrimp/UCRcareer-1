/**
 * Module dependencies
 */

var expect   = require('chai').expect
  , mongoose = require('mongoose')
  , _        = require('underscore');

var config     = require('../app/config') 
  , models     = require('../app/models');

var dbTestSettings = config.dbTestSettings
  , db             = undefined;


/**
 * Begin tests
 */

describe('models', function (){
    
    before('Create a db connection', function(done) {
        db = mongoose.createConnection(dbTestSettings.host
                                     , dbTestSettings.database
                                     , dbTestSettings.port);
        //Wait till db is connected
        db.on('connected', function(){
            done();
        });
    });
    
    after('Destroy the db connection', function() {
        db.close();
        db = undefined;
    });

    describe('#register', function (){
        it('should expose model constructors', function (){
            models.register(db); 
            
            // List of the models that should be registered
            var Models = [ 'Applicant', 'Employer', 'JobPosting' ];
            
            // Build a list of keys in db.models. Our models
            // should be in that list
            var dbModels = _.keys(db.models)
            
            // Check our models match
            var diff = _.difference(Models, dbModels);
            expect(diff).to.be.empty;
        });
    });

    describe('#applicant', function (){
        it('should return a applicant model c\'tor', function (){
            var Applicant = models.applicant();
        });
    });

    describe('#employer', function (){
        it('should return a employer model c\'tor', function (){
            var Employer = models.employer();
        });
    });

    describe('#jobPosting', function (){
        it('should return a jobPosting model c\'tor', function (){
            var JobPosting = models.jobPosting();
        });
    });

    describe('Applicant', function (){
        
        // Insert dummy data into db
        beforeEach(function(done){
            var Applicant = models.applicant();
            var johnDoe   = new Applicant({
                    credentials: {
                        password: "password1"
                      , email:    "jdoe001@ucr.edu"
                    }
                  , contact: {
                        phoneNum: "9099999999"
                    }
                  , location: {
                        city:     "Riverside"
                      , state:    "CA"
                      , zip:      "92501"
                      , address1: "1111 Linden St"
                      , country:  "USA"
                    }
                  , spec: {
                        degree: "Computer Science"
                    }
                  , personal: {
                        fName: "John"
                      , lName: "Doe"
                    }
                });
            
            // Save applicant
            johnDoe.save(function(err, applicant, numAffected){
                if(err) throw err;
                expect(numAffected).to.be.equal(1);
                done();
            });
        });

        // Remove dummy data
        afterEach(function(done){
            // Remove dummy applicant
            var Applicant = models.applicant();
            Applicant.remove({"credentials.email" : "jdoe001@ucr.edu"}, function(err){
                if(err) throw err;
                done();
            });
        });
        
        it('should be able to be saved to DB', function (done){
            var Applicant = models.applicant();
            Applicant.findOne({"credentials.email" : "jdoe001@ucr.edu"}, function(err, applicant){
                if(err) throw err;
                expect(applicant).to.not.be.equal(null);
                done();
            });
        });
        
        it('should throw an error when saved if it is missing a required field', function(done){
            var Applicant = models.applicant()
              , johnDoe   = new Applicant({});
            
            // An error should be generated since we are missing
            // required fields
            johnDoe.save(function(err){
                expect(err).to.not.be.equal(null);
                done();
            });
        });
        
        describe('#exists', function (){
            it('should check if an applicant exists, given credentials', function(done){
                var Applicant = models.applicant();
                // Test should return true
                Applicant.exists({'email':'jdoe001@ucr.edu', 'password':'password1'}, function(err, res){
                    if (err) throw err;
                    expect(res).to.be.equal(true);
                    
                    //Test should return false
                    Applicant.exists({'email':'jdoe001@ucr.edu', 'password':'password2'}, function(err, res){
                        if (err) throw err;
                        expect(res).to.be.equal(false);
                        done();
                    });
                });
            });
        });
    });

    describe('Employer', function (){
        // Insert dummy data into db
        beforeEach(function(done){
            var Employer = models.employer();
            var johnDoe   = new Employer({
                    companyName: 'Google Inc'
                  , credentials: {
                        password: "password1"
                      , email:    "jdoe001@ucr.edu"
                    }
                  , contact: {
                        phoneNum: "9099999999"
                    }
                  , location: {
                        city:     "Riverside"
                      , state:    "CA"
                      , zip:      "92501"
                      , address1: "1111 Linden St"
                      , country:  "USA"
                    }
                  , personal: {
                        fName: "John"
                      , lName: "Doe"
                    }
                });
            
            // Save employer
            johnDoe.save(function(err, employer, numAffected){
                if(err) throw err;
                expect(numAffected).to.be.equal(1);
                done();
            });
        });

        // Remove dummy data
        afterEach(function(done){
            // Remove dummy employer
            var Employer = models.employer();
            Employer.remove({"credentials.email" : "jdoe001@ucr.edu"}, function(err){
                if(err) throw err;
                done();
            });
        });
        
        it('should be able to be saved to DB', function (done){
            var Employer = models.employer();
            Employer.findOne({"credentials.email" : "jdoe001@ucr.edu"}, function(err, employer){
                if(err) throw err;
                expect(employer).to.not.be.equal(null);
                done();
            });
        });
        
        it('should throw an error when saved if it is missing a required field', function(done){
            var Employer = models.employer()
              , johnDoe   = new Employer({});
            
            // An error should be generated since we are missing
            // required fields
            johnDoe.save(function(err){
                expect(err).to.not.be.equal(null);
                done();
            });
        });
        
        describe('#exists', function (){
            it('should check if an employer exists, given credentials', function(done){
                var Employer = models.employer();
                // Test should return true
                Employer.exists({'email':'jdoe001@ucr.edu', 'password':'password1'}, function(err, res){
                    if (err) throw err;
                    expect(res).to.be.equal(true);
                    
                    //Test should return false
                    Employer.exists({'email':'jdoe001@ucr.edu', 'password':'password2'}, function(err, res){
                        if (err) throw err;
                        expect(res).to.be.equal(false);
                        done();
                    });
                });
            });
        });
 
    });
});
