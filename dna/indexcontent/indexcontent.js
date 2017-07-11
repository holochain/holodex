function genesis(){
  addAnchor();
  IndexContent("Indexing this content using holodex app.",IgnoreWords);
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
            //Code to be added for checking if the keyword has already been created for indexing
            anchor_type_create(keywords[i]);
            var IndexContentByKeyword = {Anchor_Type:keywords[i],Anchor_Text:content};
            anchor_create(IndexContentByKeyword);
          }
    }
    i--;
  }
}
