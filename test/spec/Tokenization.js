describe("TD-MATRIX Main functions test",function()
{
  var tdMatrix;

  var sentenceValue="My name is alaa",sentenceValueWithAbbrevation="My name is mr.",firstToken,secondToken,thirdToken;

  beforeEach(function()
  {
    tdMatrix=new TDMATRIX();

    /****Tokens intialzation****/
    firstToken=new Token();
    firstToken.value="name";
    firstToken.stem="name";
    firstToken.documentFreq={value:1};
    firstToken.frequency=1;


    secondToken=new Token();
    secondToken.value="alaa";
    secondToken.stem="alaa";
    secondToken.documentFreq={value:1};
    secondToken.frequency=1;


    thirdToken=new Token();
    thirdToken.value="yehia";
    thirdToken.stem="yehia";
    thirdToken.documentFreq={value:1};
    thirdToken.frequency=thirdToken.weight=1;


  });

  describe("Tokenization test",function()
  {
    it("should return false when passed string is undefined",function()
    {

        var document=new Document();

        var result=tdMatrix.ExtractNormlizedTokens(undefined,document,{});

        expect(result).toBeFalsy();
    });

    it("should return false when passed string is null",function()
    {

        var document=new Document();

        var result=tdMatrix.ExtractNormlizedTokens(null,document,{});

        expect(result).toBeFalsy();
    });


    it("should return false when passed document is null",function()
    {

        var document=new Document();

        var result=tdMatrix.ExtractNormlizedTokens("alaa",null,{});

        expect(result).toBeFalsy();
    });


    it("should return false when passed string is white space ",function()
    {

        var document=new Document();

        var result=tdMatrix.ExtractNormlizedTokens("         ",document,{});

        expect(result).toBeFalsy();
    });


    it("should return false when passed string is stop word only",function()
    {

        var document=new Document();

        var result=tdMatrix.ExtractNormlizedTokens("above",document,{});

        expect(result).toBeFalsy();
    });


    it("should return false when passed string contains tokens delimiters only",function()
    {

        var document=new Document();

        var result=tdMatrix.ExtractNormlizedTokens("?\+",document,{});

        expect(result).toBeFalsy();
    });



        it("should return true and set document IsEndedProperly to false in case passed quote ends with Abbreviation",function()
            {
              var document=new Document();

              document.value=sentenceValue;

              //Add first and second token to the document
              document.terms={"name":firstToken,"alaa":secondToken};


              var result=tdMatrix.ExtractNormlizedTokens(sentenceValueWithAbbrevation,document,{"name":1,"alaa":1});

              expect(result).toBeTruthy();
              expect(document.isEndedProperly).toBeFalsy();
            });


          it("should return true and set document IsEndedProperly to true in case passed quote not ends with Abbreviation",function()
                  {
                      var document=new Document();

                      document.value=sentenceValue;

                      //Add first and second token to the document
                      document.terms={"name":firstToken,"alaa":secondToken};


                      var result=tdMatrix.ExtractNormlizedTokens(sentenceValue,document,{"name":1,"alaa":1});

                      expect(result).toBeTruthy();
                      expect(document.isEndedProperly).toBeTruthy();
                    });

    it("should return true and  append normlized non stop-word terms of passed sentence to the passed document and also increment document frequencies for the old and new tokens",function()
        {
          var document=new Document();

          document.value=sentenceValue;

          //Add first and second token to the document
          document.terms={"name":firstToken,"alaa":secondToken};


          var result=tdMatrix.ExtractNormlizedTokens("My name-is|yehia",document,{"name":1,"alaa":1});


          expect(result).toBeTruthy();

          expect(document.value).toContain("My name-is|yehia");
          expect(document.terms["name"].frequency).toBe(2);
          expect(document.terms["yehia"]).toEqual(thirdToken);

        });
  }
  );

});
