const axios = require('axios');

// Retry helper for database operations


async function importTMDbData(strapi) {
  
  const TMDB_API_KEY = process.env.TMDB_API_KEY;
  const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

  console.log('🎬 Starting TMDb import...');

  try {
    // Fetch and import all genres first
    console.log('\n🎭 Importing genres...');
    const genresResponse = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'fr',
      }
    });

    const genreMap = new Map(); // Map to store TMDb genre ID -> Strapi genre ID

    for (const genre of genresResponse.data.genres) {
      console.log(`   🎭 Processing genre: ${genre.name}`);

      // Check if genre exists
      let existingGenre = await strapi.db.query('api::genre.genre').findOne({
        where: { db_id: genre.id }
      });

      if (!existingGenre) {
        existingGenre = await strapi.entityService.create('api::genre.genre', {
          data: {
            db_id: genre.id,
            name: genre.name,
            publishedAt: new Date(),
          }
        });
        console.log(`      ✅ Created genre: ${genre.name}`);
      } else {
        console.log(`      ⏭️  Genre already exists`);
      }

      genreMap.set(genre.id, existingGenre.id);
    }

    console.log(`\n✅ Imported ${genreMap.size} genres\n`);

    // Fetch multiple pages of popular movies
    const PAGES_TO_FETCH = 5; // Adjust this number (max 500 pages on TMDb)
    let movies = [];

    console.log(`📥 Fetching ${PAGES_TO_FETCH} pages of popular movies...`);
    
    for (let page = 1; page <= PAGES_TO_FETCH; page++) {
      console.log(`   📄 Fetching page ${page}/${PAGES_TO_FETCH}...`);
      
      const moviesResponse = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
        params: {
          api_key: TMDB_API_KEY,
          page: page,
          language: 'fr-FR',
        }
      });

      movies = movies.concat(moviesResponse.data.results);
      
      // Rate limit delay between pages
      await new Promise(resolve => setTimeout(resolve, 550));
    }

    console.log(`\n✅ Total movies to process: ${movies.length}\n`);

    for (const movie of movies) {
      console.log(`\n📽️  Processing: ${movie.title}`);

      // Check if movie exists
      const existingMovie = await strapi.db.query('api::movie.movie').findOne({
        where: { db_id: movie.id }
      });

      if (existingMovie) {
        console.log(`   ⏭️  Movie already exists, skipping...`);
        continue;
      }

      // Fetch movie details with cast
      const detailsResponse = await axios.get(`${TMDB_BASE_URL}/movie/${movie.id}`, {
        params: { api_key: TMDB_API_KEY, language: 'fr-FR' }
      });

      const creditsResponse = await axios.get(`${TMDB_BASE_URL}/movie/${movie.id}/credits`, {
        params: { api_key: TMDB_API_KEY, language: 'fr-FR' }
      });

      const movieDetails = detailsResponse.data;
      const cast = creditsResponse.data.cast; // Get ALL cast members
      const directors = creditsResponse.data.crew.filter(member => member.job === 'Director');

      console.log(`   📊 Found ${cast.length} actors and ${directors.length} directors`);

      // Import actors
      const actorIds = [];
      for (const actor of cast) {
        console.log(`   👤 Importing actor: ${actor.name}`);

        // Check if actor exists
        let existingActor = await strapi.db.query('api::actor.actor').findOne({
          where: { db_id: actor.id }
        });

        if (!existingActor) {
          // Fetch actor details
          const actorResponse = await axios.get(`${TMDB_BASE_URL}/person/${actor.id}`, {
            params: { api_key: TMDB_API_KEY, language: 'fr-FR' }
          });

          const actorDetails = actorResponse.data;

          // Create actor
          existingActor = await strapi.entityService.create('api::actor.actor', {
            data: {
              db_id: actorDetails.id,
              name: actorDetails.name,
              biography: actorDetails.biography || '',
              birthday: actorDetails.birthday,
              place_of_birth: actorDetails.place_of_birth,
              profile_path: actorDetails.profile_path ? `${IMAGE_BASE_URL}${actorDetails.profile_path}` : null,
              publishedAt: new Date(),
            }
          });

          console.log(`      ✅ Created actor: ${actorDetails.name}`);
        } else {
          console.log(`      ⏭️  Actor already exists`);
        }

        actorIds.push(existingActor.id);
        
        // Rate limit delay
        await new Promise(resolve => setTimeout(resolve, 550));
      }

      // Import directors
      const directorIds = [];
      for (const director of directors) {
        console.log(`   🎬 Importing director: ${director.name}`);

        // Check if director exists
        let existingDirector = await strapi.db.query('api::director.director').findOne({
          where: { db_id: director.id }
        });

        if (!existingDirector) {
          // Fetch director details
          const directorResponse = await axios.get(`${TMDB_BASE_URL}/person/${director.id}`, {
            params: { api_key: TMDB_API_KEY, language: 'fr-FR' }
          });

          const directorDetails = directorResponse.data;

          // Create director
          existingDirector = await strapi.entityService.create('api::director.director', {
            data: {
              db_id: directorDetails.id,
              name: directorDetails.name,
              biography: directorDetails.biography || '',
              birthday: directorDetails.birthday,
              place_of_birth: directorDetails.place_of_birth,
              profile_path: directorDetails.profile_path ? `${IMAGE_BASE_URL}${directorDetails.profile_path}` : null,
              publishedAt: new Date(),
            }
          });

          console.log(`      ✅ Created director: ${directorDetails.name}`);
        } else {
          console.log(`      ⏭️  Director already exists`);
        }

        directorIds.push(existingDirector.id);

        console.log(`      💾 Director Strapi ID: ${existingDirector.id}`);

        // Rate limit delay
        await new Promise(resolve => setTimeout(resolve, 550));
      }

      // Map genre IDs from TMDb to Strapi
      const genreIds = movieDetails.genre_ids 
        ? movieDetails.genre_ids.map(id => genreMap.get(id)).filter(Boolean)
        : movieDetails.genres 
          ? movieDetails.genres.map(g => genreMap.get(g.id)).filter(Boolean)
          : [];

      console.log(`   🎭 Genres: ${genreIds.length} genres linked`);
      console.log(`   👥 Linking ${actorIds.length} actors and ${directorIds.length} directors`);

      console.log("GenreIDS ->", genreIds);
      console.log("directorIDS ->", directorIds);
      console.log('actorsIds ->', actorIds);
      

      // Create movie with all relationships
      await strapi.entityService.create('api::movie.movie', {
        data: {
          db_id: movieDetails.id,
          title: movieDetails.title,
          overview: movieDetails.overview,
          release_date: movieDetails.release_date,
          poster_path: movieDetails.poster_path ? `${IMAGE_BASE_URL}${movieDetails.poster_path}` : null,
          vote_average: movieDetails.vote_average,
          vote_count: movieDetails.vote_count,
          actors: actorIds,
          directors: directorIds,
          genres: genreIds,
          publishedAt: new Date(),
        }
      });

      console.log(`   ✅ Movie "${movieDetails.title}" imported successfully`);
      
      // Rate limit delay
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n🎉 Import completed successfully!');
  } catch (error) {
    console.error('❌ Error during import:', error.message);
    if (error.response) {
      console.error('API Error:', error.response.data);
    }
  }
}


module.exports.importTMDbData = importTMDbData;