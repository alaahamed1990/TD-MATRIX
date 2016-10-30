describe("Documents vector distance",function()
{

var tdMatrix;

beforeEach(function()
{
  tdMatrix=new TDMATRIX();
});

it("should return 0 if passed arguments both or one the passed arguments is undefined",function()
{
  var sourceDocument=undefined;

  var destDocument=undefined;

  var distance=tdMatrix.GetDistance(sourceDocument,destDocument);

  expect(distance).toBe(0);
});



it("should return 0 if passed arguments terms both or one the passed arguments terms is undefined",function()
{
  var sourceDocument=new Document();

  var destDocument=new Document();

  var distance=tdMatrix.GetDistance(sourceDocument,destDocument);

  expect(distance).toBe(0);
});



it("should return 0 if passed arguments both or one the passed arguments is null",function()
{
  var sourceDocument=null;

  var destDocument=null;

  var distance=tdMatrix.GetDistance(sourceDocument,destDocument);

  expect(distance).toBe(0);
});



it("should return 0 if passed arguments terms both or one the passed arguments terms is null",function()
{
  var sourceDocument=new Document();

  sourceDocument.terms=null;

  var destDocument=new Document();

  destDocument.terms=null;

  var distance=tdMatrix.GetDistance(sourceDocument,destDocument);

  expect(distance).toBe(0);
});



it("should return distance for passed arguments",function()
{
    var firstToken=new Token();
    firstToken.stem="alaa";
    firstToken.weight=2;



    var secondToken=new Token();
    secondToken.stem="yehia";
    secondToken.weight=2;


    var thirdToken=new Token();
    thirdToken.stem="mecca";
    thirdToken.weight=2;


    var fourthToken=new Token();
    fourthToken.stem="alaa";
    fourthToken.weight=2;

    var sourceDocument=new Document();
    sourceDocument.terms={"alaa":firstToken ,"yehia":secondToken};

    var destDocument=new Document();
    destDocument.terms={"mecca":thirdToken,"alaa":fourthToken};

    var distance=tdMatrix.GetDistance(sourceDocument,destDocument);

    expect(distance).toBe(Math.sqrt(8));
});


});
