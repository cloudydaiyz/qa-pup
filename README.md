
<p align="center">
<img alt="App logo (pawprint)" width="200" height="200" src="./assets/logo.svg" />
</p>

<h1 align="center">
<sup>qa-pup</sup>
</h1>

<p align="center">
Small-scale, serverless clone of QA Wolf, based on my previous <a href="https://github.com/cloudydaiyz/deep-interest-validator">Deep Interest Validator</a>.
</p>

## Directories

- `/cloud`: Cloud configuration (IaC)

- `/packages`: All npm (TypeScript) packages associated with the project, excluding the one for the frontend.

- `/scripts`: Bash scripts to simplify development

- `/website`: Frontend

## Limits

- 1 scheduled test run a day
- 3 manually triggered test runs a day max
- No one can trigger a test run if 
	- a test run is already running
	- the current time is within 1 hr of a scheduled run's start time
- 10 emails get notified on test run completion max

## Enjoy!

<p align="center">
<img alt="Pups" width="200" height="200" src="./assets/pups.png" />
</p>

<p align="center">
From <a href="https://www.craiyon.com/image/BZu9J-aJQPW_-iqgmX4tvw"> https://www.craiyon.com/image/BZu9J-aJQPW_-iqgmX4tvw </a>