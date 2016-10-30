describe("Document Extraction",function()
{
  var tdMatrix;
  var sentenceValue="My name is mr.alaa.";

  var firstToken,secondToken,thirdToken,fourthToken,resultDocment,tmpDocument;

  beforeEach(function()
  {
        tdMatrix=new TDMATRIX();

        firstToken=new Token();
        firstToken.stem="name";
        firstToken.value="name";
        firstToken.frequency=firstToken.weight=1;
        firstToken.documentFreq={value:1};

        secondToken=new Token();
        secondToken.stem="my";
        secondToken.value="My";
        secondToken.frequency=secondToken.weight=1;
        secondToken.documentFreq={value:1};


        thirdToken=new Token();
        thirdToken.stem="alaa";
        thirdToken.value="alaa";
        thirdToken.frequency=thirdToken.weight=1;
        thirdToken.documentFreq={value:1};

        fourthToken=new Token();
        fourthToken.stem="yehia";
        fourthToken.value="yehia";
        fourthToken.frequency=fourthToken.weight=1;
        fourthToken.documentFreq={value:1};


        resultDocment=new Document();
        resultDocment.value="My name is mr.alaa.";
        resultDocment.terms=
        {
          "my":secondToken,
          "name":firstToken,
          "alaa":thirdToken
        };
        resultDocment.length=3;
        resultDocment.isEndedProperly=true;


        tmpDocument=new Document();
        tmpDocument.value="My name is mr.yehia.";
        tmpDocument.terms=
        {
          "my":secondToken,
          "name":firstToken,
          "yehia":fourthToken
        };
        tmpDocument.length=3;
        tmpDocument.isEndedProperly=true;
  });

  it("should return null if passed quote is null",function()
  {
    var documents=tdMatrix.ExtractDocuments(null);

    expect(documents).toBe(null);
  });

  it("should return empty array if passed quote is white space",function()
  {
      var documents=tdMatrix.ExtractDocuments(["         "]);

      expect(documents.length).toBe(0);
  });

  it("should return null if passed quote is undefined",function()
  {

      var documents=tdMatrix.ExtractDocuments(undefined);

      expect(documents).toBe(null);
  });



  it("should return empty array if passed quote contains no document",function()
  {
    var documents=tdMatrix.ExtractDocuments([]);

    expect(documents.length).toBe(0);
  });

  it("should return instances of Documents class for passed quotes",function()
  {
    var documents=tdMatrix.ExtractDocuments([sentenceValue]);

    expect(documents.length).toBe(1);
    expect(documents[0]).toEqual(resultDocment);
  });



    it("should return null when passed documents array to the assign disjoint sets function is null or undefined or empty",function()
    {
        var result=tdMatrix.ExtractDisjointSet([],0);
        expect(result).toBe(null);


        result=tdMatrix.ExtractDisjointSet(undefined,0);
        expect(result).toBe(null);

        result=tdMatrix.ExtractDisjointSet(null,0);
        expect(result).toBe(null);
    });


    it("should  group similar documents whose distance less than passed thrshold",function()
    {
        var documents=[resultDocment,tmpDocument];

        tdMatrix.NormlizeTermsFrequency(documents,0);

        var result=tdMatrix.ExtractDisjointSet(documents,.7);

        expect(resultDocment.setIndex).toBe(tmpDocument.setIndex);

        expect(result.parent[0]).toBe(0);
        expect(result.parent[1]).toBe(0);
    });
});
