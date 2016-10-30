describe("Sentece Extraction",function()
{
  var tdMatrix;
  var sentenceValue="My name is mr.alaa.My name is mr.yehia";
  var firstToken,secondToken,thirdToken,fourthToken,firstSentence,secondSentence;

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
        thirdToken.frequency=thirdToken.weight=1;
        thirdToken.documentFreq={value:1};


        fourthToken=new Token();
        fourthToken.stem="yehia";
        fourthToken.value="yehia";
        fourthToken.frequency=fourthToken.weight=1;
        fourthToken.documentFreq={value:1};


        firstSentence=new Document();
        firstSentence.value="My name is mr.alaa.";
        firstSentence.terms=
        {
          "alaa":thirdToken,
          "my":secondToken,
          "name":firstToken
        };
        firstSentence.length=3;
        firstSentence.isEndedProperly=true;



        secondSentence=new Document();
        secondSentence.value="My name is mr.yehia";
        secondSentence.terms=
            {
              "name":firstToken,
              "my":secondToken,
              "yehia":fourthToken
            };
        secondSentence.length=3;
        secondSentence.isEndedProperly=true;
  });

  it("should return null if passed quote is null",function()
  {
    var sentences=tdMatrix.ExtractSentences(null);

    expect(sentences).toBe(null);
  });

  it("should return null if passed quote is white space",function()
  {
      var sentences=tdMatrix.ExtractSentences("         ");

      expect(sentences).toBe(null);
  });

  it("should return null if passed quote is undefined",function()
  {

      var sentences=tdMatrix.ExtractSentences(undefined);

      expect(sentences).toBe(null);
  });



  it("should return empty array if passed quote contains no sentences",function()
  {
    var sentences=tdMatrix.ExtractSentences("..");

    expect(sentences.length).toBe(0);
  });

  it("should return array of sentences for passed quote",function()
  {
    var sentences=tdMatrix.ExtractSentences(sentenceValue);

    expect(sentences.length).toBe(2);
    expect(sentences[0]).toEqual(firstSentence);
    expect(sentences[1]).toEqual(secondSentence);
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


  it("should group similar documents whose distance less than passed thrshold",function()
  {
      var documents=[firstSentence,secondSentence];

      tdMatrix.NormlizeTermsFrequency(documents,0);

      var result=tdMatrix.ExtractDisjointSet(documents,.6);

      expect(firstSentence.setIndex).toBe(secondSentence.setIndex);

      expect(result.parent[0]).toBe(0);
      expect(result.parent[1]).toBe(0);
  });


});
