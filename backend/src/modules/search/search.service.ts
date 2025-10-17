import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { supabaseAdmin } from 'src/config/database.config';

@Injectable()
export class SearchServices {
  async getSearchResult(searchQuery: string) {
    if(!searchQuery || searchQuery.trim()===''){
      return []
    }
      

    const { data, error } = await supabaseAdmin
      .rpc('search_everything', {q: searchQuery});
    if (error) {
      throw new InternalServerErrorException(
        'Error during searching result: ' + error.message,
      );
    }
    return data;
  }
}
