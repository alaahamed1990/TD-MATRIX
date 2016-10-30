describe("Matrix weight",function()
{
  var tdMatrix;
  var firstToken,secondToken,thirdToken,fourthToken;

  var document,secondDocument;

  beforeEach(function()
  {
    tdMatrix=new TDMATRIX();

    firstToken=new Token();
    firstToken.stem="name";
    firstToken.value="name";
    firstToken.frequency=firstToken.weight=1;
    firstToken.documentFreq={value:2};

    secondToken=new Token();
    secondToken.stem="my";
    secondToken.value="My";
    secondToken.frequency=secondToken.weight=1;
    secondToken.documentFreq={value:2};


    thirdToken=new Token();
    thirdToken.stem="alaa";
    thirdToken.value="alaa";
    thirdToken.frequency=thirdToken.weight=3;
    thirdToken.documentFreq={value:1};

    fourthToken=new Token();
    fourthToken.stem="yehia";
    fourthToken.value="yehia";
    fourthToken.frequency=fourthToken.weight=1;
    fourthToken.documentFreq={value:1};


    document=new Document();
    document.terms=
    {
      "my":secondToken,
      "name":firstToken,
      "alaa":thirdToken
    };
    document.length=5;
    document.setIndex=0;
    document.isEndedProperly=true;





    secondDocument=new Document();
    secondDocument.terms=
    {
          "my":secondToken,
          "name":firstToken,
          "yehia":fourthToken
    };
    secondDocument.length=3;
    secondDocument.setIndex=0;
    secondDocument.isEndedProperly=true;
  });


  it("should return false in case passed documents array is empty",function()
  {
    var tfResult=tdMatrix.NormlizeTermsFrequency([],0);

    var tfIDfResult=tdMatrix.NormlizeTermsFrequencyIDf([],0);


    expect(tfResult).toBeFalsy();
    expect(tfIDfResult).toBeFalsy();
  });



    it("should return false in case passed documents array is undefined",function()
    {
      var tfResult=tdMatrix.NormlizeTermsFrequency(undefined,0);

      var tfIDfResult=tdMatrix.NormlizeTermsFrequencyIDf(undefined,0);


      expect(tfResult).toBeFalsy();
      expect(tfIDfResult).toBeFalsy();
    });



      it("should return false in case passed thrshold is negative number",function()
      {
        var tfResult=tdMatrix.NormlizeTermsFrequency([],-1);

        var tfIDfResult=tdMatrix.NormlizeTermsFrequencyIDf([],-1);


        expect(tfResult).toBeFalsy();
        expect(tfIDfResult).toBeFalsy();
      });



        it("should return false in case passed documents array is null",function()
        {
          var tfResult=tdMatrix.NormlizeTermsFrequency(null,0);

          var tfIDfResult=tdMatrix.NormlizeTermsFrequencyIDf(null,0);


          expect(tfResult).toBeFalsy();
          expect(tfIDfResult).toBeFalsy();
        });

        it("should apply weighting methodology and remove terms less than passed minimum term weight",function()
        {

         var tmpDocumentJSON=JSON.stringify(document);
         var tfResult=tdMatrix.NormlizeTermsFrequency([document],.5);

         expect(tfResult).toBeTruthy();

         expect(document.terms["alaa"].weight).toBe(3/5);

         expect(document.length).toBe(3);

         document=JSON.parse(tmpDocumentJSON);

         var tfIDfResult=tdMatrix.NormlizeTermsFrequencyIDf([document,secondDocument],0);

         expect(document.terms["name"].weight).toBe(0);
         expect(document.terms["my"].weight).toBe(0);
         expect(document.terms["alaa"].weight).toBe((3/5)*Math.log10(2));

         expect(tfIDfResult).toBeTruthy();

        });




});
