function genesis(){
  //debug("Calling addAnchor function");
  baseAnchorHash = call("anchor","addAnchor","");
  debug("Base anchor added with hash - "+baseAnchorHash);
  //ContentToIndex = "holodex : We are Indexing this content using holodex app.";

  //IndexContent(ContentToIndex);
  //CheckIndexedKeywords();
}

function IndexContent(content)
{
  IgnoreWords = "this This the is a an are and to be we :";
  var keywords=content.split(" ");
  var i = keywords.length;
  debug("Printing array keywords : "+keywords);
  debug("Content length = "+i);
  var keywordsIgnore=IgnoreWords.split(" ");
  i--;
  while (i>=0) {
    //debug("First word to be indexed : "+keywords[i]);
    var ilen=keywordsIgnore.length;
    debug("Ignore words length = "+ilen+" Iteration = "+i);
    for(j=0;j<ilen-1;j++){
        if(keywords[i]==keywordsIgnore[j])
        {
            debug("Ignoring keyword : "+keywords[i]);
            break;
        }
        else {

            checkhash = makeHash(keywords[i]);
            debug("Checkhash value : "+checkhash);
            var exists = getkeyword(keywords[i],"");

            if(exists.name=="HolochainError")
            {
              debug("Inside IF");
              call("anchor","anchor_type_create",keywords[i]);
              var IndexContentByKeyword = {Anchor_Type:keywords[i],Anchor_Text:content};
              call("anchor","anchor_create",IndexContentByKeyword);
              debug("Index created for - "+keywords[i]);
              break;
            }
            else {
              debug("Inside ELSE");
              var IndexContentByKeyword = {Anchor_Type:keywords[i],Anchor_Text:content};

              var checkexist = getkeyword(keywords[i],content);

                if(checkexist.C != JSON.stringify(IndexContentByKeyword)){
                debug("inside if else if");
                call("anchor","anchor_create",IndexContentByKeyword);
                debug("Index created for - "+keywords[i]);
              }
              else{
                debug("Index for the keywordfor this content already exists !");
              }
              break;
            }
          }
    }
    i--;
  }
  var lnk= call("anchor","anchor_type_list","");
  var strlnk = lnk.toString();
  return lnk;

}

function getkeyword(keyword,content)
{
  var keywordAnchor = {Anchor_Type:keyword,Anchor_Text:content};

  debug(keywordAnchor);
  var kahash = makeHash(keywordAnchor);

  var sources = get(kahash,{GetMask:HC.GetMask.Suorces});
  debug("Get keyword function : ")
  debug(sources);

  return sources;
}

/*function CheckIndexedKeywords()
{

  debug("Calling check");
  var lnk = call("anchor","anchor_type_list","");
  debug(lnk);
}*/
