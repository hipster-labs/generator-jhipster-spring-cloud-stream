/* global describe, beforeEach, it */

const utils = require('../generators/app/utils');
// const fse = require('fs-extra');
const fse = require('fs');
const chai = require('chai');
// Load dirty chai first to hook plugin extensions
const dirtyChai = require('dirty-chai');
const path = require('path');

chai.use(dirtyChai);
const expect = chai.expect;
const BaseGenerator = require('generator-jhipster/generators/generator-base');
// const BaseGenerator = this;
BaseGenerator.log = (msg) => { console.log(msg); }; // eslint-disable-line no-console
BaseGenerator.fs = fse;

describe('JHipster generator spring-cloud-stream', () => {
    describe('Test array property', () => {
        describe('Get array property', () => {
            it('get property on array null', () => {
                const result = utils.getPropertyInArray(null, 'test', BaseGenerator);
                expect(result).to.be.undefined();
            });
            it('get property on array empty', () => {
                const result = utils.getPropertyInArray({}, 'test', BaseGenerator);
                expect(result).to.be.undefined();
            });
            it('get a simple property that does not exist in a non-empty array', () => {
                const array = ['spring', 'application'];
                const result = utils.getPropertyInArray(array, 'test', BaseGenerator);
                expect(result).to.be.undefined();
            });
            it('get a property that does not exist in a non-empty array', () => {
                const array = { spring: { cloud: 'stream' }, application: null };
                const result = utils.getPropertyInArray(array, 'spring.cloud.toto', BaseGenerator);
                expect(result).to.be.undefined();
            });
            it('get a simple property that exist in a non-empty array', () => {
                const array = { spring: { cloud: 'stream' }, application: null };
                const result = utils.getPropertyInArray(array, 'spring', BaseGenerator);
                expect(result).eql({ cloud: 'stream' });
            });
            it('get a property that exist in a non-empty array', () => {
                const array = { spring: { cloud: 'stream' }, application: null };
                const result = utils.getPropertyInArray(array, 'spring.cloud', BaseGenerator);
                expect(result).eql('stream');
            });
            it('get a property that exist in a non-empty array', () => {
                const array = { spring: { cloud: 'stream' }, application: null };
                const result = utils.getPropertyInArray(array, 'spring.cloud', BaseGenerator);
                expect(result).eql('stream');
            });
        });
        describe('add/Update array property', () => {
            it('update property on array null', () => {
                const result = utils.updatePropertyInArray(null, 'spring.cloud', BaseGenerator, 'value');
                expect(result).to.be.undefined();
            });
            it('update property on array empty', () => {
                const result = utils.updatePropertyInArray({}, 'spring.cloud', BaseGenerator, 'value');
                expect(result).to.be.undefined();
            });
            it('add a simple property that does not exist in a non-empty array', () => {
                const array = ['spring', 'application'];
                utils.updatePropertyInArray(array, 'toto', BaseGenerator, 'value');
                const result = utils.getPropertyInArray(array, 'toto', BaseGenerator);
                expect(result).eql('value');
            });
            it('update a simple property that exist in a non-empty array', () => {
                const array = { spring: { cloud: 'stream' }, application: null };
                utils.updatePropertyInArray(array, 'spring', BaseGenerator, 'value');
                const result = utils.getPropertyInArray(array, 'spring', BaseGenerator);
                expect(result).eql('value');
            });
            it('update a property that exist in a non-empty array', () => {
                const array = { spring: { cloud: 'stream' }, application: null };
                utils.updatePropertyInArray(array, 'spring.cloud', BaseGenerator, 'value');
                const result = utils.getPropertyInArray(array, 'spring.cloud', BaseGenerator);
                expect(result).eql('value');
            });
        });
        describe('Delete array property', () => {
            it('Delete property on array null', () => {
                const result = utils.deletePropertyInArray(null, 'spring.cloud', BaseGenerator, 'value');
                expect(result).to.be.undefined();
            });
            it('Delete property on array empty', () => {
                const result = utils.deletePropertyInArray({}, 'spring.cloud', BaseGenerator, 'value');
                expect(result).to.be.undefined();
            });
            it('Delete a simple property that does not exist in a non-empty array', () => {
                const array = { spring: { cloud: 'stream' }, application: null };
                utils.deletePropertyInArray(array, 'toto', BaseGenerator);
                const length = Object.keys(array).length;
                expect(length).eql(2);
            });
            it('Delete a simple property that exist in a non-empty array', () => {
                const array = {
                    spring: {
                        cloud: 'stream',
                        profiles: 'dev'
                    },
                    application: null
                };
                utils.deletePropertyInArray(array, 'application', BaseGenerator);
                expect(Object.keys(array).length).eql(1);
                expect(Object.keys(array.spring).length).eql(2);
            });
            it('Delete a  property that  exist in a non-empty array', () => {
                const array = {
                    spring: {
                        cloud: 'stream',
                        profiles: 'dev'
                    },
                    application: null
                };
                utils.deletePropertyInArray(array, 'spring.cloud', BaseGenerator);
                const length = Object.keys(array.spring).length;
                expect(length).eql(1);
            });
        });
    });
    describe('Test yaml property', () => {
        describe('Get YAML property', () => {
            it('get property that doesnt exist', () => {
                const file = path.join(__dirname, '../test/templates/utils/application-dev.yml');
                const result = utils.getYamlProperty(file, 'toto', BaseGenerator);
                expect(result).to.be.undefined();
            });
        });
    });
});
