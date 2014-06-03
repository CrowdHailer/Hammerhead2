describe('checking when possible polyfills', function(){
  it('should round to integer', function(){
    expect(limitDecPlaces()(3.243)).toEqual(3);
  });
});