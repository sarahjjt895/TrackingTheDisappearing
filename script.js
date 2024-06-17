function createChart() {
  //Load data from "HumanActivities.csv"
  Plotly.d3.csv("HumanActivities.csv", species_data => {
    const humanActivity = species_data.map(row => row['Human Activity']);
    const endangeredSpecies = species_data.map(row => row['Endangered Species']);

    //Create a bar chart for the causes of endangered species
    var data = [{
      x: humanActivity,
      y: endangeredSpecies,
      type: 'bar',
      marker: {
        color: ['rgba(14,82,36,1) 0%', 'rgba(40,105,55,1) 14%', 'rgba(66,128,75,1) 28%', 'rgba(97,156,99,1) 45%', 'rgba(138,192,129,1) 67%', 'rgba(169,220,153,1) 84%', 'rgba(199,247,175,1) 100%'
        ]
      }
    }];

    var layout = {
      title: "Human Activities and Endangered Species",
      xaxis: { title: "Human Activity" },
      yaxis: { title: "Endangered Species" },
      coloraxis: {
        colorbar: {
          title: 'Endangered Species',
          ticksuffix: ' species'
        }
      }
    };

    // Get all modal-squares
    const modalSquares = document.querySelectorAll('.modal-square');

    // Add event listener to each modal-square
    modalSquares.forEach((square) => {
      square.addEventListener('click', () => {
        const existingOverlay = document.querySelector('.overlay-container.active');
        if (existingOverlay) {
          existingOverlay.classList.remove('active');
        }

        // Get modal image, title, and overlay description
        const modalImage = square.querySelector('.modal-image img');
        const modalTitle = square.querySelector('.modal-text h3').textContent;
        const overlayDescription = square.querySelector('.overlay-text p').textContent;
        // let temp = square.getElementsByTagName('p');
        let textContent = square.getElementsByClassName('overlay-text');
        console.log(textContent[0].innerHTML);

        // Create overlay container , with assistance from ChatGPT
        const overlay = document.createElement('div');
        overlay.classList.add('overlay-container');
        overlay.classList.add('active'); // Add the 'active' class for animation

        const overlayContent = document.createElement('div');
        overlayContent.classList.add('overlay-content');
        overlayContent.innerHTML = `
          <span class="close-button">&times;</span>
          <div class="overlay-image">
            <img src="${modalImage.src}" alt="${modalImage.alt}" />
          </div>
          <div class="overlay-text">
          ${textContent[0].innerHTML}
          </div>
        `;

        overlay.appendChild(overlayContent);

        const modalContainer = document.querySelector('.modal-container');
        modalContainer.parentNode.insertBefore(overlay, modalContainer.nextSibling);

        overlay.style.display = 'flex';

        // Add event listener to close button
        const closeButton = overlay.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
          overlay.remove();
        });
        // Close overlay when clicking outside
        document.addEventListener('click', (event) => {
          if (!overlay.contains(event.target) && !square.contains(event.target)) {
            overlay.remove();
          }
        });
      });
    });



    //Load data from "Endangered.csv"
    const unpack = (data, key) => data.map(row => row[key]);

    Plotly.d3.csv("Endangered.csv", population_data => {

      //first choropleth
      const location = unpack(population_data, 'Code')
      const quant_z = unpack(population_data, 'Quantity')
      const country = unpack(population_data, 'Country')

      //Create a choropleth map from called data in "Endangered.csv"
      let data = [{
        type: 'choropleth',
        locations: location,
        z: quant_z,
        text: country,
        colorscale: 'Greens',
        marker: {
          line: {
            color: 'rgb(180,180,180)',
            width: 0.5
          }
        },
        colorbar: {
          ticksuffix: '',
          title: 'Endangered<br>mammals'
        }
      }
      ];

      let layout = {
        // title: 'Endangered Animals per country',
        geo: {
          showframe: false,
          projection: {
            typeL: 'mercator'

          }
        }
      };

      Plotly.newPlot("choropleth", data, layout);

    });

    Plotly.newPlot('chart', data, layout);
  });
}

createChart();
