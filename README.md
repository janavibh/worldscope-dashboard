# Web Development Project 5 - *WorldScope Dashboard*

Submitted by: **Janavi Bhalala**

This web app: **WorldScope is a global data dashboard built with React. It fetches country data from a public API and displays an at-a-glance summary of countries, regions, income levels, capitals, and location data. Users can search for countries by name and filter the dashboard by region.**

Time spent: **2** hours spent in total

## Required Features

The following **required** functionality is completed:

* [x] **The site has a dashboard displaying a list of data fetched using an API call**

  * [x] The dashboard displays at least 10 unique items, one per row
  * [x] The dashboard includes at least two features in each row

* [x] **The useEffect() React hook and async/await syntax are used**

* [x] **The app dashboard includes at least three summary statistics about the data**

  * [x] First unique summary statistic: total countries shown
  * [x] Second unique summary statistic: regions represented
  * [x] Third unique summary statistic: income levels shown
  * [x] Additional summary statistic: countries with capitals

* [x] **A search bar allows the user to search for an item in the fetched data**

  * [x] The search bar correctly filters items in the list, only displaying items matching the search query
  * [x] The list of results dynamically updates as the user types into the search bar

* [x] **An additional filter allows the user to restrict displayed items by specified categories**

  * [x] The filter restricts items in the list using a different attribute than the search bar
  * [x] The filter correctly filters items in the list, only displaying items matching the selected region
  * [x] The dashboard list dynamically updates as the user adjusts the filter

## Stretch Features

The following **optional** features are implemented:

* [x] Multiple filters can be applied simultaneously

  * [x] Users can search by country name and filter by region at the same time

* [x] Filters use different input types

  * [x] The search feature uses a text input
  * [x] The region filter uses a dropdown menu

* [ ] User can enter specific bounds for filter values

## Additional Features

The following **additional** features are implemented:

* [x] The app uses a polished dark dashboard UI with glowing cards and glass-style sections
* [x] The table displays country name, region, income level, capital, latitude, and longitude
* [x] The app displays loading and error states
* [x] Summary statistics update dynamically based on the search and filter results
* [x] The layout is responsive for smaller screens

## Video Walkthrough

Here's a walkthrough of implemented required features:

<img src='walkthrough.gif' title='Video Walkthrough' width='600' alt='Video Walkthrough' />

GIF created with **ezgif**.

## Notes

One challenge I encountered was choosing an API that reliably returned enough data for a dashboard. I used the World Bank Countries API because it provides structured country information such as region, income level, capital city, latitude, and longitude.

Another challenge was making the summary statistics update correctly when the user searched or filtered the data. I solved this by calculating the statistics from the filtered country list instead of the full dataset.

## License

```
Copyright 2026 Janavi Bhalala

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
