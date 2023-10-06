from flask import Flask, render_template, request, jsonify
import requests
import json
from ebay_oauth_token import OAuthToken


# Create an instance of the OAuthUtility class oauth_utility = OAuthToken(client_id, client_secret) # Get the application token


app = Flask(__name__, static_url_path='', static_folder='static')


app_id = 'RickLi-csci570-PRD-af6fbf322-38e64f8a'


def spacing():
    print()
    print()


@app.route('/', methods=['GET'])
def home():
    return app.send_static_file('index.html')


@app.route('/item', methods=['GET'])
def get_single_item():
    spacing()
    print("item flask success!")
    # print(request.args.get('id'))
    itemId = request.args.get('id')
    # ebay_api_url = 'https://open.api.ebay.com/shopping'
    # item_id = request.args.get('item_id')

    # if not item_id:
    #     return jsonify({'error': 'Item ID is required'}), 400
    app_id = 'RickLi-csci570-PRD-af6fbf322-38e64f8a'
    client_secret = 'PRD-f6fbf322889d-a562-415f-818d-1098'

    url = 'https://open.api.ebay.com/shopping'
    # url = f'https://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid={app_id}&siteid=0&version=967&ItemID=352077758916&IncludeSelector=Description,Details,ItemSpecifics'
    oauth_utility = OAuthToken(app_id, client_secret)
    # application_token = oauth_utility.getApplicationToken()

    # print(itemId)
    # print(app_id)
    # print(application_token)
    params = {
        'callname': 'GetSingleItem',
        'responseencoding': 'JSON',
        'appid': app_id,
        'siteid': 0,
        'version': 967,
        'ItemID': itemId,
        'IncludeSelector': 'Details,Description,ItemSpecifics',
    }
    # print(oauth_utility.getApplicationToken())
    headers = {
        "X-EBAY-API-IAF-TOKEN": oauth_utility.getApplicationToken()
    }
    # print()
    # response = requests.get(ebay_endpoint, params=params, headers=headers)
    response = requests.get(url, params=params, headers=headers)

    # try:
    #     # Code that might raise an exception
    # # More code...

    # except ZeroDivisionError as e:
    #     print(e)

    # print(response)
    response.raise_for_status()  # Raise an error for bad responses (e.g., 404 or 500)
    data = response.json()
    # item_details = response.json().get('Item')
    result = {}
    item = data['Item']
    print(item)
    img = item['PictureURL'][0]
    link = item['ViewItemURLForNaturalSearch']
    title = item['Title']
    subtitle = item['Subtitle'] if 'Subtitle' in item else ""
    price = f"{item['CurrentPrice']['Value']} {item['CurrentPrice']['CurrencyID']}"
    postal = f" ,{item['PostalCode']}" if 'PostalCode' in item else ''
    location = item['Location']+postal
    seller = item['Seller']['UserID']
    if 'ReturnPolicy' in data['Item']:
        status = item['ReturnPolicy']['ReturnsAccepted'] if 'ReturnsAccepted' in item['ReturnPolicy'] else ""
        Policy = f" with in {item['ReturnPolicy']['ReturnsWithin']}" if 'ReturnsAccepted' in item[
            'ReturnPolicy'] else ""
        returnPolicy = status + Policy
        result['Return'] = returnPolicy
    specifics = item['ItemSpecifics']['NameValueList']
    result['Photo'] = img
    result['Link'] = link
    result['Title'] = title
    result['SubTitle'] = subtitle
    result['Price'] = price
    result['Location'] = location
    result['Seller'] = seller

    list = []
    for event in specifics:
        # print(1)
        # print(event['Name'])
        # print(2)
        # print(event['Value'][0])
        # print(3)
        # print({event['Name']: event['Value'][0]})
        list.append({event['Name']: event['Value'][0]})
    result['Specifics'] = list
    for el in result:
        print(f"{el}: {result[el]}")
    return result


@app.route('/data', methods=['GET'])
def handle_get_request():
    ebay_endpoint = 'https://svcs.ebay.com/services/search/FindingService/v1'
    data = {}

    for key, value in request.args.items():
        data[key] = value

    processed_data = {
        'message': 'Data received successfully', 'data': data}
    key = data['keywords']

    # Return the processed data in the response
    print("flask success!!!")

    # eBay API endpoint and credentials

    # data= {"keywords":"mouse","lower-bound":"149","upper-bound":"149","new":"on","free":"on","expedited":"on","sorting":"Price: highest first"}

    sort = {
        "Best Match": "BestMatch",
        "Price: highest first": "CurrentPriceHighest",
        "Price + Shipping: highest first": 'PricePlusShippingHighest',
        "Price + Shipping: lowest first": "PricePlusShippingLowest",
    }

    conditions = {
        "new": '1000',
        "used": '3000',
        "very-good": '4000',
        "good": '5000',
        "acceptable": '6000',
    }

    cnds = []
    for cnd in conditions:
        if cnd in data:
            cnds.append(conditions[cnd])
    # print(cnds)
    # Set the parameters for the request
    params = {
        "OPERATION-NAME": "findItemsAdvanced",
        "SERVICE-VERSION": "1.0.0",
        "SECURITY-APPNAME": app_id,
        "RESPONSE-DATA-FORMAT": "json",
        "REST-PAYLOAD": True,
        "keywords": data['keywords'],  # Replace with your search keywords
        "paginationInput.entriesPerPage": 10,
        "paginationInput.pageNumber": 1,
        "sortOrder": sort[data['sorting']],
    }

    idx = 0
    #
    # print(data)
    if 'lowerBound' in data:
        params[f"itemFilter({idx}).name"] = "MinPrice"
        params[f"itemFilter({idx}).value"] = data['lowerBound']
        idx += 1

    if 'upperBound' in data:
        params[f"itemFilter({idx}).name"] = "MaxPrice"
        params[f"itemFilter({idx}).value"] = data['upperBound']
        idx += 1

    if 'acceptance' in data:
        params[f"itemFilter({idx}).name"] = "ReturnsAcceptedOnly"
        params[f"itemFilter({idx}).value"] = 'true'
        idx += 1

    if 'free' in data:
        cond = True
        params[f"itemFilter({idx}).name"] = "FreeShippingOnly"
        params[f"itemFilter({idx}).value"] = "true"
        idx += 1

    # if cnds:
    #     params[f'itemFilter({idx}).name'] = 'Condition'
    #     params[f'itemFilter({idx}).value'] = cnds
    #     idx += 1

    if cnds:
        params[f'itemFilter({idx}).name'] = 'Condition'
        index = 0
        for cnd in cnds:
            params[f'itemFilter({idx}).value({index})'] = cnd
            index += 1

    # if 'expedited' in data:
    #   params[f"itemFilter({idx}).name"] = "ExpeditedShippingType"
    #   params[f"itemFilter({idx}).value"] = "Expedited"
    #   idx+=1

    # Make the API request
    # print()
    # print(ebay_endpoint)
    # print()
    # print(params)
    # print()

    response = requests.get(ebay_endpoint, params=params)
    data = json.loads(response.text)
    # Print the response
    # data = response.text
    # print(data)
    count = data["findItemsAdvancedResponse"][0]['paginationOutput'][0]['totalEntries'][0]
    # count = data["findItemsAdvancedResponse"][0]["searchResult"][0]['@count']
    if int(count) == 0:
        return [{'key': key}, {'count': 0}, []]
    itemIndex = 0
    # {'key': data['keywords']},
    itemData = data["findItemsAdvancedResponse"][0]["searchResult"][0]['item']
    items = [{'key': key}, {'count': count}, []]
    # print(len(itemData))
    count = 0
    for item in itemData:
        # print(count)
        count += 1
        spacing()
        shippingInfo = itemData[itemIndex]['shippingInfo'][0]
        categoryData = itemData[itemIndex]['primaryCategory'][0]
        price = itemData[itemIndex]['sellingStatus'][0]['convertedCurrentPrice'][0]['__value__']
        shippingFee = itemData[itemIndex]['shippingInfo'][0]['shippingServiceCost'][0]['__value__'] if (
            'shippingServiceCost' in shippingInfo) else 0
        # print(float(shippingFee), type(shippingFee))
        if float(shippingFee) > 0.01:
            shippingFee = f"( +${shippingFee} for shipping)"

        else:

            shippingFee = ""
        print(itemData[itemIndex]['viewItemURL'][0])
        list = {
            'gallary': itemData[itemIndex]['galleryURL'][0],
            'itemId': itemData[itemIndex]['itemId'][0],
            'title': itemData[itemIndex]['title'][0],
            'category': categoryData['categoryName'][0],
            'view': itemData[itemIndex]['viewItemURL'][0],
            'condition': itemData[itemIndex]['condition'][0]['conditionDisplayName'][0] if 'condition' in itemData[itemIndex] else 'none',
            'topRate': itemData[itemIndex]['topRatedListing'][0],
            'price': f"${price} {shippingFee}",
        }
        print(list['gallary'])

        items[2].append(list)
        itemIndex += 1
    return jsonify(items)


if __name__ == '__main__':
    app.run(host="127.0.0.1", port=8080)
