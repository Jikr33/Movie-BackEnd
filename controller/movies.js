const Category = require("../models/Movies");
const axios = require("axios");
const url = require("url");
// middleware functions
exports.getFavorites = async (req, res, next) => {
    //  const category = await Category.findById("63c7b36bfcf4cda4db0cc761")  // finds category by ID

    // console.log(category);
    // res.status(200).json({
    //     success: true,
    //     data: category,
    //     user: req.userID,
    // });
    try {
        var favoriteMovies = [];
        const category = await Category.find({ __v: 0 }); // finds all categories
        for (let x of category) {
            console.log(x);
            const options = {
                method: "GET",
                url: "https://mdblist.p.rapidapi.com/",
                params: { i: x.id },
                headers: {
                    "X-RapidAPI-Key":
                        "676d565cf9msh03913601fbc68d3p181769jsnc91829350ae4",
                    "X-RapidAPI-Host": "mdblist.p.rapidapi.com",
                },
            };
            await axios
                .request(options)
                .then(function (response) {
                    delete response.data["keywords"];
                    favoriteMovies.push(response.data);
                    console.log(response.data);
                })
                .catch(function (error) {
                    console.error(error);
                });
            setTimeout(() => null, 1000);
        }
        res.status(200).json({
            success: true,
            mov: favoriteMovies,
            data: category,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err,
        });
    }

    // };
};
exports.getMovie = async (req, res, next) => {
    try {
        var movie = req.params.id;
        movie = decodeURIComponent(movie);
        // const options = {
        //     method: "GET",
        //     url: "https://mdblist.p.rapidapi.com/",
        //     params: { s: movie, l: 25 },
        //     headers: {
        //         "X-RapidAPI-Key":
        //             "676d565cf9msh03913601fbc68d3p181769jsnc91829350ae4",
        //         "X-RapidAPI-Host": "mdblist.p.rapidapi.com",
        //     },
        // };
        // await axios
        //     .request(options)
        //     .then(function (response) {
        //         console.log(response.data);

        //         return res.status(200).json({
        //             success: true,
        //             data: `Shows movies with ${movie} Name`,
        //             movies: response.data,
        //         });
        //     })
        //     .catch(function (error) {
        //         return res.status(400).json({
        //             success: false,
        //             error: `${req.params.id}, ner tei movie bhguee!!!`,
        //         });
        //     });
        // const options = {
        //     method: "GET",
        //     url: "https://movie-database-alternative.p.rapidapi.com/",
        //     params: { s: toString(movie), r: "json" },
        //     headers: {
        //         "X-RapidAPI-Key":
        //             "676d565cf9msh03913601fbc68d3p181769jsnc91829350ae4",
        //         "X-RapidAPI-Host": "movie-database-alternative.p.rapidapi.com",
        //     },
        // };
        const options = {
            method: "GET",
            url: "https://movie-database-alternative.p.rapidapi.com/",
            params: { s: movie },
            headers: {
                "X-RapidAPI-Key":
                    "676d565cf9msh03913601fbc68d3p181769jsnc91829350ae4",
                "X-RapidAPI-Host": "movie-database-alternative.p.rapidapi.com",
            },
        };
        await axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                return res.status(200).json({
                    success: true,
                    data: `Shows movies with ${movie} Name`,
                    movies: response.data,
                });
            })
            .catch(function (error) {
                res.status(400).json({
                    success: false,
                    err: error,
                });
            });
        // await axios
        //     .request(options)
        //     .then(function (response) {
        //         console.log(movie);
        //         return res.status(200).json({
        //             success: true,
        //             data: `Shows movies with ${movie} Name`,
        //             movies: response,
        //         });
        //     })
        //     .catch(function (error) {
        //         return res.status(400).json({
        //             success: false,
        //             error: `${req.params.id}, ner tei movie bhguee!!!`,
        //             err: error
        //         });
        //     });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err,
        });
    }
};
exports.createFavorite = async (req, res, next) => {
    console.log("data: ", req.body);

    try {
        const category = await Category.create(req.body);

        res.status(200).json({
            success: true,
            data: category,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err,
        });
    }
};
exports.deleteFavorite = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(400).json({
                success: false,
                error: `${req.params.id}, id tei category bhguee!!!`,
            });
        }
        res.status(200).json({
            success: true,
            data: `Deletes category with  ${req.params.id} ID`,
            category: category,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err,
        });
    }
};
exports.getMovieDetails = async (req, res, next) => {
    try {
        console.log(req.params.id);
        const options = {
            method: "GET",
            url: "https://mdblist.p.rapidapi.com/",
            params: { i: req.params.id },
            headers: {
                "X-RapidAPI-Key":
                    "676d565cf9msh03913601fbc68d3p181769jsnc91829350ae4",
                "X-RapidAPI-Host": "mdblist.p.rapidapi.com",
            },
        };

        await axios
            .request(options)
            .then(function (response) {
                delete response.data.keywords;
                console.log(response.data);
                res.status(200).json({
                    success: true,
                    data: `SHows movie with  ${req.body} ID`,
                    result: response.data,
                });
            })
            .catch(function (error) {
                console.error(error);
                res.status(400).json({
                    success: false,
                    err: error,
                });
            });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err,
        });
    }
};

exports.generateMeme = async (req, res, next) => {
    try {
        // const options = {
        //     method: "GET",
        //     url: "https://reddit-meme.p.rapidapi.com/memes/top",
        //     headers: {
        //         "X-RapidAPI-Key":
        //             "676d565cf9msh03913601fbc68d3p181769jsnc91829350ae4",
        //         "X-RapidAPI-Host": "reddit-meme.p.rapidapi.com",
        //     },
        // };
        // await axios
        //     .request(options)
        //     .then(function (response) {
        //         res.status(200).json({
        //             success: true,
        //             data: `Generates memes...`,
        //             category: response.data,
        //         });
        //         console.log(response.data);
        //     })
        //     .catch(function (error) {
        //         console.error(error);
        //         return res.status(400).json({
        //             success: false,
        //             error: `${req.params.id}, id tei category bhguee!!!`,
        //         });
        //     });

        const options = {
            method: "GET",
            url: "https://programming-memes-images.p.rapidapi.com/v1/memes",
            headers: {
                "X-RapidAPI-Key":
                    "676d565cf9msh03913601fbc68d3p181769jsnc91829350ae4",
                "X-RapidAPI-Host": "programming-memes-images.p.rapidapi.com",
            },
        };

        await axios
            .request(options)
            .then(function (response) {
                res.status(200).json({
                    success: true,
                    data: `Generates memes...`,
                    category: response.data,
                });
                console.log(response.data);
            })
            .catch(function (error) {
                console.error(error);
                return res.status(400).json({
                    success: false,
                    error: `Meme gargaj chadsangui`,
                });
            });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err,
        });
    }
};
