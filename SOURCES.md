# Sources and claim boundaries

Accessed 8 October 2026. The application uses these sources for project context and research metadata. No external source supplies the synthetic calibration image or a measured result in the browser demo.

| Source | Use in this prototype |
| --- | --- |
| Team-supplied `SIH2026_PS26252_GangaDrishti.pptx` | Problem statement, proposed architecture, sampling paths, cartridge status, intended operators and validation plan. Claims in the deck are identified as proposal claims. |
| [Jal Jeevan Mission Drinking Water Quality Monitoring & Surveillance Framework](https://jaljeevanmission.gov.in/sites/default/files/guideline/WQMS-Framework.pdf) | Village FTK, lab and WQMIS workflow; dashboards and sample handling context. |
| [Jal Jeevan Mission FTK training news](https://jaljeevanmission.gov.in/node/377) | Five-woman village surveillance committee and FTK use context. The article's historic training count is not reused. |
| [BIS drinking-water standards overview](https://www.bis.gov.in/wp-content/uploads/2024/05/Packaged-Drinking-Water-Corrected-16-Pg-KS_organized.pdf) | Identifies IS 10500 as the drinking-water specification. |
| [BIS archive of standards](https://www.bis.gov.in/archive-standard-of-the-month/?lang=en) | Lists IS 18998:2025/ISO 24187:2023 for principles of environmental microplastic analysis. The prototype does not assert a drinking-water microplastic threshold. |
| [Crossref DOI metadata](https://api.crossref.org/works/10.1109/IC3ECSBHI67834.2026.11469066) and [IEEE record](https://ieeexplore.ieee.org/document/11469066) | Team paper title, authors, conference, date and DOI. The full paper and its authoritative abstract were not available in this repository. |
| [California State Water Resources Control Board microplastic method](https://www.waterboards.ca.gov/drinking_water/certlic/drinkingwater/documents/microplastics/swb-mp2-rev1.pdf) | Example of confirmatory laboratory infrared spectroscopy for drinking-water microplastics. The app does not implement the method. |
| [Maes et al., Scientific Reports (2017)](https://doi.org/10.1038/srep44501) | Nile Red fluorescence and image analysis as a screening technique. |
| [Erni-Cassola et al., Environmental Science & Technology (2017)](https://doi.org/10.1021/acs.est.7b04512) | Automated fluorescent particle counting at 20–1000 µm. |
| [Shim et al., Marine Pollution Bulletin (2016)](https://doi.org/10.1016/j.marpolbul.2016.10.049) | Nile Red staining and organic-remnant limitations. |
| [Ahmadi Tabar et al., ACS Omega (2025)](https://doi.org/10.1021/acsomega.4c10473) | Basis for MIP electrode context, the relative impedance formula and selecting a 20–45 Hz point near −45° baseline phase. The app processes supplied readings but cannot infer a concentration. |
| [Li et al., Journal of Hazardous Materials (2020)](https://doi.org/10.1016/j.jhazmat.2019.121498) | Related lanthanide detection technique for tetracycline antibiotics. No antibiotic result is generated. |
| [US EPA National Lakes Assessment 2017](https://www.epa.gov/national-aquatic-resource-surveys/national-lakes-assessment-2017-results) and [EPA image file](https://www.epa.gov/system/files/styles/large/private/images/2022-11/15012086289_2b788fd44d_o.jpg?itok=39kUdM4g) | Source of the real field sampling photo displayed in the masthead. It shows US EPA researchers, not the GangaDrishti team or an Indian field test. The app crops and color-adjusts the photo for layout without changing its scientific content. |

## Demonstration data

`public/calibration-disc.svg` and `public/sample-manifest.csv` are **synthetic demonstration inputs made for this prototype**. Their positions, count and metadata are illustrative. They are not samples, images or measurements from a drinking-water source. An uploaded image is processed locally; no data leaves the browser except when the user chooses an external map or paper link.

The microplastic browser algorithm is colour thresholding plus connected-region measurement. It does **not** run the team's YOLOv8 model or identify polymer types. The PFAS processor computes relative impedance change from operator-entered values or an uploaded CSV sweep, but it has no electrode, calibration curve or analyte identity test. Neither channel determines potability. The microplastic 95% range describes Poisson counting uncertainty only and excludes calibration, recovery, sampling and classification errors.
