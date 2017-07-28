function genesis(){

  //Calling addAnchor function for creating the base anchor
  baseAnchorHash = call("anchor","addAnchor","");
  debug("Base anchor added with hash - "+baseAnchorHash);

  var ContentToIndex1 = {content:"holodex : We are Indexing this content using holodex app. this",details:"can include timestamp, etc."};
  ContentToIndexhash1 = makeHash(ContentToIndex1);

  var ContentToIndex2 = {content:"holodex can also be used for searching keywords",details:"can include timestamp,lication, etc."};
  ContentToIndexhash2 = makeHash(ContentToIndex2);


  //called in genesis temporarily. Once bridging between apps gets workig, index content will be called from the HC app that is
  //using holodex
  IndexContent(ContentToIndex1.content,ContentToIndexhash1,"English");
  IndexContent(ContentToIndex2.content,ContentToIndexhash2,"English");

}

//Function called by the HC app to search for a string of words and get all the objects indexed for the words.
function searchKeywords(searchString)
{
  var searchArr = searchString.split(/,| |:|-/);
  var i = searchArr.length;
  var mergedList = [];
  var list = [];

  debug("Array contents : ");
  i--;

  while(i>=0)
  {
    debug("While loop ------------ i = "+i);
    debug(searchArr[i]);
    list = call("anchor","anchor_list",searchArr[i]);

    var temp = JSON.parse(list);
    debug(list);
    for(var m=0;m<temp.length;m++)
    {
      var temp1 = JSON.parse(temp[m].Anchor_Text);
      debug(temp1.Anchor_Text);
      mergedList=union(mergedList,temp1.Anchor_Text);
    }

    i--;
  }
  var jsonmer = JSON.parse(JSON.stringify(mergedList));

  return jsonmer;
}

//To provide a list of all the objects that are indexed against the search string
function union(mergedList,list)
{

  if(mergedList.length==0)
  {
    if(list != "")
      mergedList.push(list);
  }
  else
  {
    check=find(mergedList,list);

    if(check==false)
    {
      if(list != "")
      mergedList.push(list);
    }
  }
  debug(mergedList);
  return mergedList;
}

//Function to check if the object has already been covered in the merged list
function find(mainArr, check)
{

  for(i=0;i<=mainArr.length;i++)
  {

    if(mainArr[i] == check)
    {
      return true;
    }
  }
  return false;
}

//Index content function is called from a HC application by passing the content and the hash of the object so that the link cant be
//made directly to the object.
function IndexContent(content,hashOfObject,language)
{


  var HTIgnoreWords = getIgnoreWords(language);
  //debug(HTIgnoreWords);

  var IgnoreWords = "this is the a an are and can also with : -";
  var keywords=content.split(" ");
  var i = keywords.length;
  debug("Indexing content : "+keywords);
  debug("Content length = "+i);
  var keywordsIgnore=IgnoreWords.split(" ");
  i--;
  while (i>=0) {

    //var ilen=keywordsIgnore.length;

    //for(j=0;j<ilen-1;j++){
        //if(keywords[i]==keywordsIgnore[j])
        if(HTIgnoreWords[keywords[i]]==true)
        {
            debug("Ignoring keyword : "+keywords[i]);
            //break;
        }
        else {


            var exists = getkeyword(keywords[i],"");            //Checking if achor type for the keyword already exists

            if(exists.name=="HolochainError")                   //If not , create anchor type with the keyword and then the link to content
            {

              call("anchor","anchor_type_create",keywords[i]);
              var IndexContentByKeyword = {Anchor_Type:keywords[i],Anchor_Text:hashOfObject};
              call("anchor","anchor_create",IndexContentByKeyword);
              debug("Index created for - "+keywords[i]);
              //break;
            }
            else {                                              //Else, only create the anchor for content and link content(object)
                                                                //to keyword
              debug("Inside ELSE");
              var IndexContentByKeyword = {Anchor_Type:keywords[i],Anchor_Text:hashOfObject};

              var checkexist = getkeyword(keywords[i],hashOfObject);

                if(checkexist.C != JSON.stringify(IndexContentByKeyword)){

                call("anchor","anchor_create",IndexContentByKeyword);
                debug("Index created for - "+keywords[i]);
              }
              else{
                debug("Index for the keyword for this content already exists !");
              }
              //break;
            }
          }
    //}
    i--;
  }
  var lnk= call("anchor","anchor_type_list","");
  var strlnk = lnk.toString();
  return lnk;

}

//Function to check existance of the anchor object
function getkeyword(keyword,hashOfObject)
{
  var keywordAnchor = {Anchor_Type:keyword,Anchor_Text:hashOfObject};

  debug(keywordAnchor);
  var kahash = makeHash(keywordAnchor);

  var sources = get(kahash,{GetMask:HC.GetMask.Suorces});
  debug("Get keyword function : ")
  debug(sources);

  return sources;
}

//This is the list of common words(stop words) which do not need to Indexed for search. This list needs to be enhanced to cover all
//possible ignore words
function getIgnoreWords(language)
{
  var IWreturn = {};

  IWreturn['English'] = getEnglishIW();

  return IWreturn['English'];
}

function getEnglishIW()
{
  var EnglishIgnoreWords = {};

  EnglishIgnoreWords['this'] = true;
  EnglishIgnoreWords['This'] = true;
  EnglishIgnoreWords['the'] = true;
  EnglishIgnoreWords['is'] = true;
  EnglishIgnoreWords['a'] = true;
  EnglishIgnoreWords['an'] = true;
  EnglishIgnoreWords['are'] = true;
  EnglishIgnoreWords['and'] = true;
  EnglishIgnoreWords['to'] = true;
  EnglishIgnoreWords['be'] = true;
  EnglishIgnoreWords['we'] = true;
  EnglishIgnoreWords[':'] = true;
  EnglishIgnoreWords['-'] = true;

  return EnglishIgnoreWords;
}
