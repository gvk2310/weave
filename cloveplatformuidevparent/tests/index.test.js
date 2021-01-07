const fullName = (firstName, lastName) => `Hey ${firstName} ${lastName}, this is your first test using Jest!`;

describe('Testing the tests setup', () => {
    it('Should return the full name', () => {
        const result = `Hey Naveen Raj, this is your first test using Jest!`;
        expect(fullName("Naveen", "Raj")).toBe(result);
    });
});
