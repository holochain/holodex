function genesis(){
  //debug("Calling addAnchor function");
  baseAnchorHash = call("anchor","addAnchor","");
  dubug("Base anchor added w");
  ContentToIndex = "We are Indexing this content using holodex app.";
  IgnoreWords = "this This the is a an are and to be we";
  IndexContent(ContentToIndex,IgnoreWords);
}

function IndexContent(content,IgnoreWords)
{
  var keywords=content.split(" ");
  var i = keywords.length;
  var keywordsIgnore=IgnoreWords.split(" ");
  while (i>0) {
    var ilen=keywordsIgnore.length;
    for(j=0;j<ilen;j++){
        if(keywords[i]==keywordsIgnore[j])
            break;
        else {
            checkhash = makeHash(keywords[i]);
            var exists = getkeyword(chcekhash);
            if(exists=="")
            {
              call("anchor","anchor_type_create",keywords[i]);
              var IndexContentByKeyword = {Anchor_Type:keywords[i],Anchor_Text:content};
              call("anchor","anchor_create",IndexContentByKeyword);
            }
            else {
              var IndexContentByKeyword = {Anchor_Type:keywords[i],Anchor_Text:content};
              call("anchor","anchor_create",IndexContentByKeyword);
            }
          }
    }
    i--;
  }
}

function getkeyword(checkhash)
{
  var sources = get(checkhash,{GetMask:HC.GetMask.Sources});
  if (isErr(sources)) {sources = [];}
  if (sources != undefined) {
    var n = sources.length -1;
    return (n >= 0) ? sources[n] : "";
}
return "";}
