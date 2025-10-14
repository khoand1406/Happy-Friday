import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guard/auth.guard";
import { SearchServices } from "./search.service";

@UseGuards(JwtAuthGuard)
@Controller('search')

export class SearchController{
    constructor(private readonly SearchService: SearchServices){}

    @Get()
    async result(@Query('searchQuery') searchQuery){
        const result=  this.SearchService.getSearchResult(searchQuery);
        return result;
    }
}