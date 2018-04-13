function genesis(){
  debug("To side genesis!")
  //Calling addAnchor function for creating the base anchor
  baseAnchorHash = call("anchor","addAnchor","");
return true;
}

function bridgeGenesis(side,dna,appData)
{
  debug("Wroking bridgeGenesis on To side "+ side+" dna: "+dna+" appData: "+appData);

  return true;
}

/*function addToVolunteerNodes(AppKeyHash){

  debug("In function addToVolunteerNodes");
  var VolunteerNode = commit("VolunteerNode",AppKeyHash);
  commit("volunteer_link",{Links:[{Base:App.Key.Hash,Link:VolunteerNode,Tag:"VolunteerNode"}]});
  debug("VolunteerNode :"+ VolunteerNode);
  var addSelfAsAnchor = {Anchor_Type:"IndexNodes",Anchor_Text:App.Key.Hash};

                                                                  //Checking if the Index Node anchor tyoe is created
  var anchorMainIndex = {Anchor_Type:"IndexNodes",Anchor_Text:""};
  var amhash = makeHash("anchor",anchorMainIndex);
  var checkexist = get(amhash,{GetMask:HC.GetMask.Sources});

  if(checkexist != JSON.stringify(anchorMainIndex)){           //If there are no index nodes(anhor type), create Index node tyoe
  //if(checkexist == HC.HashNotFound){                         //and add self as IndexNodes

    debug("Creating anchor type IndexNodes");

    var indN = call("anchor","anchor_type_create","IndexNodes");
    debug("Index node type added successfully with hash : "+indN);
    debug("Adding self to index nodes ... "+App.Key.Hash);
     var lnk = call("anchor","anchor_create",addSelfAsAnchor);

  }
  else {                                                      //Else just add self as IndexNodes anchor
    debug("Adding self to index nodes ... "+App.Key.Hash);
      var lnk = call("anchor","anchor_create",addSelfAsAnchor);
  }

  return lnk;

}*/

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
    debug("\nComputing for keyword : "+searchArr[i]);
    list = call("anchor","anchor_list",searchArr[i]);

    var temp = JSON.parse(list);

    for(var m=0;m<temp.length;m++)
    {
      mergedList=union(mergedList,temp[m]);
    }

    i--;
  }

  debug("\nSearched words exist in above objects !");

  return mergedList;
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
  //debug(mergedList);
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
function IndexContent(msgObj)
{

  content = msgObj.content;
  hashOfObject = msgObj.hashOfObject;
  language = msgObj.language;
  var HTIgnoreWords = getIgnoreWords(language);

  var keywords=content.split(" ");
  var i = keywords.length;

  i--;
  while (i>=0) {

        debug("------------------------ "+keywords[i]+" --------------------------");
        if(HTIgnoreWords[keywords[i]]==true)
        {
            debug("Ignoring keyword : "+keywords[i]);

        }
        else {

            var exists = getkeyword(keywords[i],"");            //Checking if achor type for the keyword already exists


            //if(exists.name=="HolochainError")                   //If not , create anchor type with the keyword and then the link to content
            if(exists == null)
            {
              call("anchor","anchor_type_create",keywords[i]);
              var IndexContentByKeyword = {Anchor_Type:keywords[i],Anchor_Text:hashOfObject};
              call("anchor","anchor_create",IndexContentByKeyword);
              debug("Index created for - "+keywords[i]);

            }
            else {                                              //Else, only create the anchor for content and link content(object)
                                                                //to keyword
              debug("Anchor type already exists");
              var IndexContentByKeyword = {Anchor_Type:keywords[i],Anchor_Text:hashOfObject};
              var checkexist = getkeyword(keywords[i],hashOfObject);

              if(checkexist != JSON.stringify(IndexContentByKeyword)){

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
  debug("*******************************************************************************************");
  debug("Object indexed for keywords : ");
  debug(lnk)
  return hashOfObject;

}

//Function to check existance of the anchor object
function getkeyword(keyword,hashOfObject)
{

  var keywordAnchor = {Anchor_Type:keyword,Anchor_Text:hashOfObject};

  debug(keywordAnchor);
  var kahash = makeHash("anchor",keywordAnchor);
  debug("Keyword anchor hash : ");
  debug(kahash);
  var sources = get(kahash,{GetMask:HC.GetMask.Sources});
  debug("Sources : ");
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

  EnglishIgnoreWords["a"]=true;
  EnglishIgnoreWords["am"]=true;
  EnglishIgnoreWords["an"]=true;
  EnglishIgnoreWords["and"]=true;
  EnglishIgnoreWords["are"]=true;
  EnglishIgnoreWords["as"]=true;
  EnglishIgnoreWords["at"]=true;
  EnglishIgnoreWords["be"]=true;
  EnglishIgnoreWords["but"]=true;
  EnglishIgnoreWords["by"]=true;
  EnglishIgnoreWords["can"]=true;
  EnglishIgnoreWords["cannot"]=true;
  EnglishIgnoreWords["could"]=true;
  EnglishIgnoreWords["couldnt"]=true;
  EnglishIgnoreWords["do"]=true;
  EnglishIgnoreWords["done"]=true;
  EnglishIgnoreWords["for"]=true;
  EnglishIgnoreWords["get"]=true;
  EnglishIgnoreWords["go"]=true;
  EnglishIgnoreWords["had"]=true;
  EnglishIgnoreWords["has"]=true;
  EnglishIgnoreWords["have"]=true;
  EnglishIgnoreWords["he"]=true;
  EnglishIgnoreWords["her"]=true;
  EnglishIgnoreWords["here"]=true;
  EnglishIgnoreWords["him"]=true;
  EnglishIgnoreWords["his"]=true;
  EnglishIgnoreWords["how"]=true;
  EnglishIgnoreWords["i"]=true;
  EnglishIgnoreWords["if"]=true;
  EnglishIgnoreWords["in"]=true;
  EnglishIgnoreWords["into"]=true;
  EnglishIgnoreWords["is"]=true;
  EnglishIgnoreWords["it"]=true;
  EnglishIgnoreWords["it's"]=true;
  EnglishIgnoreWords["my"]=true;
  return EnglishIgnoreWords;
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

function validate(entry_type,entry,header,sources) {
    if (entry_type == "anchor_links"||entry_type == "anchor") {
      return true;
    }
    return true
}

function validateLink(linkingEntryType,baseHash,linkHash,tag,pkg,sources){
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
