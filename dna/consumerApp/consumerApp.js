function genesis()
{

  return true;
}

function bridgeGenesis(VolunteerForIndex)                     //Volunteering Ratio to be added
{

  if(VolunteerForIndex == "true")
  {


    var VolunteerNode = commit("VolunteerNode",VolunteerForIndex);
    commit("volunteer_link",{Links:[{Base:App.Key.Hash,Link:VolunteerNode,Tag:"VolunteerNode"}]});
    debug("VolunteerNode :"+ VolunteerNode);
    var addSelfAsAnchor = {Anchor_Type:"IndexNodes",Anchor_Text:App.Key.Hash};

    var anchorMain = {Anchor_Type:"Anchor_Type",Anchor_Text:""};

    var amhash = makeHash(anchorMain);

    var checkexist = get(amhash,{GetMask:HC.GetMask.Suorces});
    debug("Checkexist : "+checkexist.C);
    if(checkexist.C = JSON.stringify(anchorMain)){

      debug("Creating anchor type IndexNodes");
      //var IndexNodeAnchorType = {Anchor_Type:"IndexNodes",Anchor_Text:""};
      call("anchor","anchor_type_create","IndexNodes");

      debug("Adding self to index nodes ... "+App.Key.Hash);
       var lnk = call("anchor","anchor_create",addSelfAsAnchor);

    }
    else {
      debug("Adding self to index nodes ... "+App.Key.Hash);
        var lnk = call("anchor","anchor_create",addSelfAsAnchor);
    }
    var ret = JSON.parse(lnk);
    debug(ret[0]);
    return VolunteerNode;
  }
  else
  {
    var VolunteerNode = commit("VolunteerNode",VolunteerForIndex);
    commit("volunteer_link",{Links:[{Base:App.Key.Hash,Link:VolunteerNode,Tag:"VolunteerNode"}]});
    return VolunteerNode;
  }
}

function selectIndexNode()
{

  var VolunteerNodeH = getLink(App.Key.Hash,"VolunteerNode",{Load:true});
  debug("Volunteer node value :"+VolunteerNodeH.Links[0].E)

  if(VolunteerNodeH.Links[0].E == "true")
  {
    var key = App.Key.Hash;
  }
  else
  {
    var indexNodes = call("anchor","anchor_list","IndexNodes");
    var IndexNodesjs = JSON.parse(indexNodes);

    var numberOfIndexNodes = IndexNodesjs.length;
    debug("Number of index nodes : "+numberOfIndexNodes);

    var selectedNumber = Math.floor(Math.random()*numberOfIndexNodes);

    var key = IndexNodesjs[selectedNumber].Anchor_Text;
  }
  return key;
}

function createObject1ForTest()
{
  var ContentToIndex1 = {content:"holodex : We are Indexing this content using holodex app. this",details:"can include timestamp, etc."};
  ContentToIndexhash1 = makeHash(ContentToIndex1);
  return ContentToIndexhash1;
}

function createObject2ForTest()
{
  var ContentToIndex2 = {content:"holodex can also be used for searching keywords",details:"can include timestamp,lication, etc."};
  ContentToIndexhash2 = makeHash(ContentToIndex2);
  return ContentToIndexhash1;
}

function indexObject(object)
{
  var indexNode = selectIndexNode();
  debug("Selected index node : "+indexNode);
  var objHash = makeHash(object);
  debug("Hash of object : "+objHash);

  var createIndex = send(indexNode,{type:"createIndex",content:object.content,hashOfObject:objHash,language:"English"})
  return createIndex;
}


function searchContent(StringOfsearchKeywords)
{
  var indexNode = selectIndexNode();
  debug("Selected index node : "+indexNode);
  var searchResults = send(indexNode,{type:"searchKeywords",searchString:StringOfsearchKeywords});
  return searchResults;
}

function isErr(result) {
    return ((typeof result === 'object') && result.name == "HolochainError");
}
function validatePut(entry_type,entry,header,pkg,sources) {
    return validate(entry_type,entry,header,sources);
}
function validateCommit(entry_type,entry,header,pkg,sources) {
    return validate(entry_type,entry,header,sources);
}
// Local validate an entry before committing ???
function validate(entry_type,entry,header,sources) {
//debug("entry_type::"+entry_type+"entry"+entry+"header"+header+"sources"+sources);
    if (entry_type == "anchor_links"||entry_type == "anchor") {
      return true;
    }
    return true
}

function validateLink(linkingEntryType,baseHash,linkHash,tag,pkg,sources){
    // this can only be "room_message_link" type which is linking from room to message
//debug("LinkingEntry_type:"+linkingEntryType+" baseHash:"+baseHash+" linkHash:"+linkHash+" tag:"+tag+" pkg:"+pkg+" sources:"+sources);
if(linkingEntryType=="anchor_links")
return true;


return true;
}
function validateMod(entry_type,hash,newHash,pkg,sources) {return false;}
function validateDel(entry_type,hash,pkg,sources) {return false;}
function validatePutPkg(entry_type) {return null}
function validateModPkg(entry_type) { return null}
function validateDelPkg(entry_type) { return null}
function validateLinkPkg(entry_type) { return null}


////////////////////////////////Code below this is just for test cases/////////////////////////////////////////////////////////

function receive(input, msg)
{
  if(msg.type == "createIndex")
  {
    var retVal = IndexContent(msg.content,msg.hashOfObject,msg.language);
  }
  else if(msg.type == "searchKeywords")
  {
    debug("Searching for the string :::::: "+msg.searchString);
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
