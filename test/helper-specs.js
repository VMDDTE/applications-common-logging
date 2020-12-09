/* eslint-disable no-unused-expressions */
/* eslint-disable no-new */
import { describe, it } from 'mocha'
import chai from 'chai'
import sinon from 'sinon'
import { buildLogger, buildLogMessage } from '../logging/helpers'
import cron from 'node-cron'
import simpleNodeLogger from 'simple-node-logger'
import fs from 'fs'

const expect = chai.expect

describe('Logging Helper', function () {
    describe('#buildLogger', function () {
        beforeEach(function () {
            sinon.stub(console, 'info')
        })

        it('should create file logger with defaults', async function () {
            const logDirectory = 'logs'
            sinon.stub(fs, 'existsSync').withArgs(logDirectory).returns(false)
            const fileSystemStub = sinon.stub(fs, 'mkdirSync')
            sinon.stub(fs, 'readdir').withArgs(logDirectory).returns([])

            const scheduleStub = sinon
                .stub(cron, 'schedule')
                .yields()
                .returns({})

            // We need to stub the rolling file logger otherwise test dont exit correctly
            const simpleNodeLoggerInfoStub = { info: sinon.spy() }
            sinon
                .stub(simpleNodeLogger, 'createRollingFileLogger')
                .returns(simpleNodeLoggerInfoStub)

            buildLogger('testFileLogger', true)

            expect(fileSystemStub.calledWith('logs')).to.be.true

            expect(console.info.calledWith('Creating rolling file logger')).to.be.true

            const cronSchedule = '0 0 * * *'
            sinon.assert.calledWith(scheduleStub, cronSchedule, sinon.match.func)

            expect(console.info.calledWith(`Cron scheduling deletion of old log files: '${cronSchedule}'`)).to.be.true

            expect(simpleNodeLoggerInfoStub.info.calledWith('Begin deletion of old logs')).to.be.true
        })

        // Could add tests to check file creation etc

        it('should create console logger', async function () {
            buildLogger('testConsole', false)

            expect(console.info.calledOnce).to.be.true
            expect(console.info.calledWith('Creating console logger')).to.be.true
        })

        afterEach(function () {
            sinon.restore() // Unwraps the spy
        })
    })

    describe('#buildLogMessage', function () {
        it('should return log message in correct format', async function () {
            const correlationId = '12345'
            const actionMessage = 'someAction'
            const logMessage = buildLogMessage(correlationId, 'get', 'test.url.com', actionMessage)

            expect(logMessage).to.have.property('vmd')
            expect(logMessage.vmd).to.have.property('correlationId')
            expect(logMessage.vmd.correlationId).to.equal(correlationId)

            expect(logMessage).to.have.property('message')
            expect(logMessage.message).to.equal(actionMessage)

            expect(logMessage).to.have.property('httpVerb')
            expect(logMessage.httpVerb.toUpperCase()).to.equal('GET')

            expect(logMessage).to.have.property('url')
            expect(logMessage.url).to.equal('test.url.com')
        })
    })
})
