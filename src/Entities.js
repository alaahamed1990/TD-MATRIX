
class Document
{
  constructor()
  {

    this.Value="";

    this.terms={};

    //length af remving stop words and stemming terms
    this.length=0;

    this.SetIndex=0;
  }


  get Color()
  {
    var value=this.SetIndex;

    value >>>= 0;
    var b = value & 0xFF,
        g = (value & 0xFF00) >>> 8,
        r = (value & 0xFF0000) >>> 16,
        a = ( (value & 0xFF000000) >>> 24 ) / 255 ;
    return "rgba(" + [r, g, b, 1].join(",") + ")";
  }

  getTermByIndex(targetIndex)
  {
    var counter=0;

    for(var index in this.terms)
    {
      if(counter++==targetIndex)
      {
        return this.terms[index];
      }
    }
  }
}


class Term
{
  constructor()
  {
    //Represent the value of the term
    this.value="";

    //Represent the frequency of the term in the container document
    this.Frequency=0;

    //Represents the weight of the term in the term document matrix
    this.Weight=0;

    this.DocumentFreq=null;

    this.Stem=null;
  }
}
