import { getDate, setIcons, createImage, getCityInfo, postData } from '../client/js/helpers';

describe('Helper functions test', () => {
    describe('getDate', () => {
        it('It should be true if getDate is defined', () => {
            expect(getDate).toBeDefined();
        });
    
        it('It should be true if getDate is a function', () => {
            expect(typeof getDate).toBe('function');
        });
    }),
    describe('setIcons', () => {
        it('It should be true if setIcons is defined', () => {
            expect(setIcons).toBeDefined();
        });
    
        it('It should be true if setIcons is a function', () => {
            expect(typeof setIcons).toBe('function');
        });
    }),  
    describe('createImage', () => {
        it('It should be true if createImage is defined', () => {
            expect(createImage).toBeDefined();
        });
    
        it('It should be true if createImage is a function', () => {
            expect(typeof createImage).toBe('function');
        });
    }),
    describe('getCityInfo', () => {
        it('It should be true if getCityInfo is defined', () => {
            expect(getCityInfo).toBeDefined();
        });
    
        it('It should be true if getCityInfo is a function', () => {
            expect(typeof getCityInfo).toBe('function');
        });
    }),
    describe('postData', () => {
        it('It should be true if postData is defined', () => {
            expect(postData).toBeDefined();
        });
    
        it('It should be true if postData is a function', () => {
            expect(typeof postData).toBe('function');
        });
    })
})
