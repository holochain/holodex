function genesis(){

  //Calling addAnchor function for creating the base anchor
  baseAnchorHash = call("anchor","addAnchor","");
  debug("Base anchor added with hash - "+baseAnchorHash);

  var ContentToIndex1 = {content:"holodex : We are Indexing this content using holodex app. this",details:"can include timestamp, etc."};
  ContentToIndexhash1 = makeHash(ContentToIndex1);
  var ContentToIndex2 = {content:"holodex can also be used for searching keywords",details:"can include timestamp,lication, etc."};
  ContentToIndexhash2 = makeHash(ContentToIndex2);

  IndexContent(ContentToIndex1.content,ContentToIndexhash1,"English");
  IndexContent(ContentToIndex2.content,ContentToIndexhash2,"English");
}

function receive(input, msg)
{
  if(msg.type == "createIndex")
  {
    var retVal = IndexContent(msg.content,msg.hashOfObject,msg.language);
  }
  else if(msg.type == "searchKeywords")
  {
    var retVal = searchKeywords(msg.searchString);
  }
  return retVal;
}

//Function called by the HC app to search for a string of words and get all the objects indexed for the words.
function searchKeywords(searchString)
{
  var searchArr = searchString.split(/,| |:|-/);
  var i = searchArr.length;
  var mergedList = [];
  var list = [];

  i--;

  while(i>=0)
  {

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

  var keywords=content.split(" ");
  var i = keywords.length;

  i--;
  while (i>=0) {


        if(HTIgnoreWords[keywords[i]]==true)
        {
            debug("Ignoring keyword : "+keywords[i]);

        }
        else {


            var exists = getkeyword(keywords[i],"");            //Checking if achor type for the keyword already exists

            if(exists.name=="HolochainError")                   //If not , create anchor type with the keyword and then the link to content
            {

              call("anchor","anchor_type_create",keywords[i]);
              var IndexContentByKeyword = {Anchor_Type:keywords[i],Anchor_Text:hashOfObject};
              call("anchor","anchor_create",IndexContentByKeyword);
              debug("Index created for - "+keywords[i]);

            }
            else {                                              //Else, only create the anchor for content and link content(object)
                                                                //to keyword

              var IndexContentByKeyword = {Anchor_Type:keywords[i],Anchor_Text:hashOfObject};

              var checkexist = getkeyword(keywords[i],hashOfObject);

                if(checkexist.C != JSON.stringify(IndexContentByKeyword)){

                call("anchor","anchor_create",IndexContentByKeyword);
                debug("Index created for - "+keywords[i]);
              }
              else{
                debug("Index for the keyword for this content already exists !");
              }

            }
          }

    i--;
  }
  var lnk= call("anchor","anchor_type_list","");
  var strlnk = lnk.toString();
  debug("Object indexed for keywords : "+strlnk);
  return hashOfObject;

}

//Function to check existance of the anchor object
function getkeyword(keyword,hashOfObject)
{
  var keywordAnchor = {Anchor_Type:keyword,Anchor_Text:hashOfObject};

  debug(keywordAnchor);
  var kahash = makeHash(keywordAnchor);

  var sources = get(kahash,{GetMask:HC.GetMask.Suorces});
  //debug("Get keyword function : ")
  //debug(sources);

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
