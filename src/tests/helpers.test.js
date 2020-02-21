import { getDate, setIcons, createImage, getCityInfo, postData } from '../client/js/helpers';

describe('Helper functions test', () => {
    describe('getDate', () => {
        it('It should be true if getDate is defined', () => {
            expect(getDate).toBeDefined();
        });
    
        it('It should be true if getDate is a function', () => {
            expect(typeof getDate).toBe('function');
        });
    })
})
